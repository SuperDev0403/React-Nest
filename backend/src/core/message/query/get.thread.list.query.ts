import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { classToClass, plainToClass } from 'class-transformer';
import { Message } from '../model/message.entity';
import { Thread } from '../model/thread';

export class GetThreadListQueryData {
	userId: string;
	pagination?: {
		offset?: number;
		limit?: number;
	};
	withDeleted?: boolean;
}

export class GetThreadListQueryResponse {
	threadList: Thread[];
	totalItemCount: number;
}

@Injectable()
export class GetThreadListQuery {

	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
	}

	async execute(data: GetThreadListQueryData): Promise<GetThreadListQueryResponse> {
		const response = await this.getThreadList(data);

		await this.addThreadNewMessageCount(response.threadList, data);

		return response;
	}

	private async getThreadList(data: GetThreadListQueryData): Promise<GetThreadListQueryResponse> {
		const qb = this.repository.createQueryBuilder('message');

		qb.leftJoinAndSelect('message.from', 'from');
		qb.leftJoinAndSelect('message.to', 'to');
		qb.leftJoinAndSelect('message.payload', 'payload');

		qb.leftJoin(
			Message, 'b',
			'message.threadId = b.threadId AND message.createdAt < b.createdAt',
		);

		qb.where('b.createdAt IS NULL');
		qb.andWhere(new Brackets(qb1 => {
			qb1.where('message.fromId = :userId');
			qb1.orWhere('message.toId = :userId');
		}), {userId: data.userId});

		qb.addOrderBy('message.createdAt', 'DESC');

		// ---
		if (!data.withDeleted) {
			qb.andWhere('(message.deletedAt IS NULL OR message.deletedAt > NOW())');
		}

		if (!!data.pagination) {
			qb.skip(data.pagination.offset);
			qb.take(data.pagination.limit);
		}

		const [messageList, totalItemCount] = await qb.getManyAndCount();

		const threadList = messageList.map(m => {
			const user = m.fromId === data.userId ? m.to : m.from;
			const id = m.threadId;
			const lastMessage = classToClass(m);

			return plainToClass(Thread, {id, user, lastMessage});
		});

		return plainToClass(GetThreadListQueryResponse, {
			threadList, totalItemCount,
		});
	}

	private async addThreadNewMessageCount(threadList: Thread[], data: GetThreadListQueryData): Promise<void> {
		if (threadList.length <= 0) {
			return;
		}

		const threadIdList = threadList.map(t => t.id);

		const qb = this.repository.createQueryBuilder('message');
		qb.select('message.threadId', 'threadId');
		qb.addSelect('COUNT(*)', 'newMessageCount');
		qb.distinct(true);

		qb.where('(message.seenAt IS NULL OR message.seenAt > NOW())');
		qb.andWhere('message.threadId IN (:...threadIdList)', {threadIdList});
		qb.andWhere('message.toId = :userId', {userId: data.userId});
		qb.addGroupBy('message.threadId');

		const result = await qb.getRawMany();
		const countByThreadId = result.reduce((carry, item) => {
			carry[item.threadId] = item.newMessageCount;
			return carry;
		}, {});

		for (const thread of threadList) {
			if (!!countByThreadId[thread.id]) {
				thread.newMessageCount = parseFloat(countByThreadId[thread.id]);
			}
		}
	}

}
