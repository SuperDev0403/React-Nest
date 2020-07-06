import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Brackets, Repository } from 'typeorm';
import { GetListQueryData } from '../../../lib/entity/query/get.list.query';
import { Message } from '../model/message.entity';
import { MessageType } from '../model/message.type';

export class GetMessageListQueryData extends GetListQueryData {
	threadId?: string;
	betweenUserId?: [string, string];
	userId?: string;
	typeList?: MessageType[];
}

export class GetMessageListQueryResponse {
	messageList: Message[];
	totalItemCount: number;
}

@Injectable()
export class GetMessageListQuery {

	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
	}

	async execute(data: GetMessageListQueryData): Promise<GetMessageListQueryResponse> {
		const qb = this.repository.createQueryBuilder('message');

		qb.leftJoinAndSelect('message.from', 'from');
		qb.leftJoinAndSelect('message.to', 'to');
		qb.leftJoinAndSelect('message.payload', 'payload');

		if (!!data.betweenUserId && data.betweenUserId.length === 2) {
			qb.andWhere(new Brackets(qb1 => {
				qb1.where('(message.fromId = :userId_0 AND message.toId = :userId_1)');
				qb1.orWhere('(message.fromId = :userId_1 AND message.toId = :userId_0)');
			}), {
				':userId_0': data.betweenUserId[0],
				':userId_1': data.betweenUserId[1],
			});
		}

		if (!!data.typeList && data.typeList.length > 0) {
			qb.andWhere('message.type IN (:...typeList)', {typeList: data.typeList});
		}

		if (!!data.threadId) {
			qb.andWhere('message.threadId = :threadId', {
				threadId: data.threadId,
			});
		}

		if (!!data.userId) {
			qb.andWhere(new Brackets(qb1 => {
				qb1.where('message.fromId = :userId');
				qb1.orWhere('message.toId = :userId');
			}), {userId: data.userId});
		}

		// ---
		if (!data.withDeleted) {
			qb.andWhere('(message.deletedAt IS NULL OR message.deletedAt > NOW())');
		}

		if (!!data.pagination) {
			qb.skip(data.pagination.offset);
			qb.take(data.pagination.limit);
		}

		if (!!data.orderBy) {
			for (const property of Object.keys(data.orderBy)) {
				const direction = data.orderBy[property];
				qb.addOrderBy(property, direction as ('ASC' | 'DESC'));
			}
		} else {
			qb.addOrderBy('message.createdAt', 'DESC');
		}

		const [messageList, totalItemCount] = await qb.getManyAndCount();

		return plainToClass(GetMessageListQueryResponse, {
			messageList, totalItemCount,
		});
	}

}
