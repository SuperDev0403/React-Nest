import { TypeOrmEntityRepository } from '../../../lib/entity/repository/type.orm.entity.repository';
import { Message } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class MessageEntityRepository extends TypeOrmEntityRepository<Message> {

	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
		super();
	}

}
