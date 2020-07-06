import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MessageEntityRepository } from './repository/message.entity.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './model/message.entity';
import { User } from '../user/model/user.entity';
import { CreateMessageCommand } from './command/create.message.command';
import { GetMessageQuery } from './query/get.message.query';
import { GetMessageListQuery } from './query/get.message.list.query';
import { UpdateLastMessageSeenAtCommand } from './command/update.last.message.seen.at.command';
import { GetThreadListQuery } from './query/get.thread.list.query';
import { GetThreadQuery } from './query/get.thread.query';

const providers = [
	MessageEntityRepository,
	CreateMessageCommand,
	UpdateLastMessageSeenAtCommand,
	GetMessageQuery,
	GetMessageListQuery,
	GetThreadListQuery,
	GetThreadQuery,
];

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, User]),
		UserModule,
	],
	providers,
	exports: providers,
})
export class MessageModule {

}
