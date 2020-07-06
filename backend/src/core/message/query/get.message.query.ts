import { Message } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { GetOneQueryData } from '../../../lib/entity/query/get.one.query';

export class GetMessageQueryData extends GetOneQueryData {
	id?: string;
	userId?: string;
}

export class GetMessageQueryResult {
	message?: Message;
}

export class GetMessageQuery {
	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
	}

	async execute(data: GetMessageQueryData): Promise<GetMessageQueryResult> {
		const qb = this.repository.createQueryBuilder('message');

		qb.leftJoinAndSelect('message.from', 'from');
		qb.leftJoinAndSelect('message.to', 'to');
		qb.leftJoinAndSelect('message.payload', 'payload');

		if (!!data.id) {
			qb.andWhere('message.id = :id', {id: data.id});
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

		if (!!data.orderBy) {
			for (const property of Object.keys(data.orderBy)) {
				const direction = data.orderBy[property];
				qb.addOrderBy(property, direction as ('ASC' | 'DESC'));
			}
		}

		const message = await qb.getOne();

		return plainToClass(GetMessageQueryResult, {message});
	}
}
