import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmEntityRepository } from '../../../lib/entity/repository/type.orm.entity.repository';
import { UserContact } from '../model/user.contact.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserContactEntityRepository extends TypeOrmEntityRepository<UserContact> {

	constructor(
		@InjectRepository(UserContact) protected readonly repository: Repository<UserContact>,
	) {
		super();
	}

	async findOneForUsers(data: { user1Id: string; user2Id: string }): Promise<UserContact | undefined> {
		const qb = this.repository.createQueryBuilder('contact');

		qb.where('(contact.user1Id = :user1Id AND contact.user2Id = :user2Id)');
		qb.orWhere('(contact.user2Id = :user1Id AND contact.user1Id = :user2Id)');
		qb.setParameters({user1Id: data.user1Id, user2Id: data.user2Id});

		return await qb.getOne();
	}
}
