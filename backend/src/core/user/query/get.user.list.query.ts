import { User } from '../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { GetListQueryData } from '../../../lib/entity/query/get.list.query';

export class GetUserListQueryData extends GetListQueryData {
	idList?: string[];
}

export class GetUserListQueryResult {
	userList: User[];
	totalItemCount: number;
}

export class GetUserListQuery {

	constructor(
		@InjectRepository(User) protected readonly repository: Repository<User>,
	) {
	}

	async execute(data: GetUserListQueryData): Promise<GetUserListQueryResult> {
		const qb = this.repository.createQueryBuilder('user');

		if (!!data.idList && data.idList.length > 0) {
			qb.andWhere('user.id IN (:...idList)', {idList: data.idList});
		}

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

		const [userList, totalItemCount] = await qb.getManyAndCount();

		return plainToClass(GetUserListQueryResult, {
			userList, totalItemCount,
		});
	}

}
