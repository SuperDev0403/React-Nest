import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { classToClass, plainToClass } from 'class-transformer';
import { Message } from '../model/message.entity';
import { Thread } from '../model/thread';

export class GetThreadQueryData {
	id: string;
	userId: string;
	withDeleted?: boolean;
}

export class GetThreadQueryResponse {
	thread?: Thread;
}

@Injectable()
export class GetThreadQuery {

	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
	}

	async execute(data: GetThreadQueryData): Promise<GetThreadQueryResponse> {
		const response = await this.getThread(data);

		await this.addThreadNewMessageCount(response.thread, data);

		return response;
	}

	private async getThread(data: GetThreadQueryData): Promise<GetThreadQueryResponse> {
		const qb = this.repository.createQueryBuilder('message');

		qb.leftJoinAndSelect('message.from', 'from');
		qb.leftJoinAndSelect('message.to', 'to');
		qb.leftJoinAndSelect('message.payload', 'payload');

		qb.leftJoin(
			Message, 'b',
			'message.threadId = b.threadId AND message.createdAt < b.createdAt',
		);

		qb.where('b.createdAt IS NULL');
		qb.andWhere('message.threadId = :threadId', {
			threadId: data.id,
		});
		qb.andWhere(new Brackets(qb1 => {
			qb1.where('message.fromId = :userId');
			qb1.orWhere('message.toId = :userId');
		}), {userId: data.userId});

		qb.addOrderBy('message.createdAt', 'DESC');

		// ---
		if (!data.withDeleted) {
			qb.andWhere('(message.deletedAt IS NULL OR message.deletedAt > NOW())');
		}

		const message = await qb.getOne();

		if (!message) {
			return plainToClass(GetThreadQueryResponse, {});
		}

		const thread = plainToClass(Thread, {
			id: message.threadId,
			user: message.from.id === data.userId ? message.to : message.from,
			lastMessage: classToClass(message),
		});

		return plainToClass(GetThreadQueryResponse, {
			thread,
		});
	}

	private async addThreadNewMessageCount(thread: Thread, data: GetThreadQueryData): Promise<void> {
		const qb = this.repository.createQueryBuilder('message');
		qb.select('message.threadId', 'threadId');
		qb.addSelect('COUNT(*)', 'newMessageCount');
		qb.distinct(true);

		qb.where('(message.seenAt IS NULL OR message.seenAt > NOW())');
		qb.andWhere('message.threadId = :threadId', {threadId: thread.id});
		qb.andWhere('message.toId = :userId', {userId: data.userId});
		qb.addGroupBy('message.threadId');

		const result = await qb.getRawOne();

		if (!!result) {
			thread.newMessageCount = parseFloat(result.newMessageCount);
		} else {
			thread.newMessageCount = null;
		}
	}

}
