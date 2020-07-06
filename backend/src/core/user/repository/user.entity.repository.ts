import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { TypeOrmEntityRepository } from '../../../lib/entity/repository/type.orm.entity.repository';
import { FindOneQuery } from '../../../lib/entity/repository/entity.repository.interface';

export interface FindOneUserQuery extends FindOneQuery {
	email?: string;
	confirmationToken?: string;
	emailOrPhone?: string;
}

export class UserEntityRepository extends TypeOrmEntityRepository<User> {

	constructor(
		@InjectRepository(User) protected readonly repository: Repository<User>,
	) {
		super();
	}

	async findOneBy(query: FindOneUserQuery): Promise<User | undefined> {
		const qb = this.repository.createQueryBuilder('user');

		if (!!query.id) {
			qb.andWhere('user.id = :id', {id: query.id});
		}
		if (!!query.email) {
			qb.andWhere('LOWER(user.email) = :email', {email: query.email.toLowerCase()});
		}
		if (!!query.confirmationToken) {
			qb.andWhere('user.confirmationToken = :confirmationToken', {confirmationToken: query.confirmationToken});
		}
		if (!!query.emailOrPhone) {
			qb.andWhere('(LOWER(user.email) = :emailOrPhone OR user.phoneNumber = :emailOrPhone)', {emailOrPhone: query.emailOrPhone.toLowerCase()});
		}
		if (!!query.confirmationToken) {
			qb.andWhere('user.confirmationToken = :confirmationToken', {confirmationToken: query.confirmationToken});
		}

		return qb.getOne();
	}

	async findOneForAuth(query: { email: string }): Promise<User | undefined> {
		const qb = this.repository.createQueryBuilder('user');

		qb.addSelect('user.password');
		qb.where('LOWER(user.email) = :email', {email: query.email.toLowerCase()});

		return qb.getOne();
	}
}
