import { User } from '../model/user.entity';
import { GetListQueryData } from '../../../lib/entity/query/get.list.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserContact } from '../model/user.contact.entity';

export class GetUserContactListQueryData extends GetListQueryData {
	userId: string;
}

export class GetUserContactListQueryResult {
	contactList: User[];
	totalItemCount: number;
}

@Injectable()
export class GetUserContactListQuery {

	constructor(
		@InjectRepository(User) protected readonly repository: Repository<User>,
	) {
	}

	async execute(data: GetUserContactListQueryData): Promise<GetUserContactListQueryResult> {
		const qb = this.repository.createQueryBuilder('user');

		qb.innerJoin(
			UserContact,
			'contact',
			`
      (contact.user1Id = user.id AND contact.user2Id = :userId) OR
      (contact.user2Id = user.id AND contact.user1Id = :userId)
      `,
			{userId: data.userId},
		);

		// ---
		if (!data.withDeleted) {
			qb.andWhere('(user.deletedAt IS NULL OR user.deletedAt > NOW())');
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
			qb.addOrderBy('user.lastName', 'ASC');
		}

		const [contactList, totalItemCount] = await qb.getManyAndCount();

		return plainToClass(GetUserContactListQueryResult, {
			contactList, totalItemCount,
		});
	}
}
