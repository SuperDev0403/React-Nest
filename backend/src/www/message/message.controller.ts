import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
	UnprocessableEntityException,
	UseGuards,
} from '@nestjs/common';
import { GetThreadListQuery } from '../../core/message/query/get.thread.list.query';
import { GetMessageListQuery } from '../../core/message/query/get.message.list.query';
import { CreateMessageCommand, CreateMessageCommandData } from '../../core/message/command/create.message.command';
import {
	UpdateLastMessageSeenAtCommand,
	UpdateLastMessageSeenAtCommandData,
} from '../../core/message/command/update.last.message.seen.at.command';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../auth/auth.decorator';
import { User } from '../../core/user/model/user.entity';
import { GetMessageQuery } from '../../core/message/query/get.message.query';
import { plainToClass } from 'class-transformer';
import { MessageGateway } from './message.gateway';
import { GetThreadQuery } from '../../core/message/query/get.thread.query';
import { PaginationDto } from '../lib/dto/pagination.dto';

@Controller('message')
export class MessageController {

	static MESSAGE_LIST_DEFAULT_LIMIT = 100;

	constructor(
		private readonly getThreadListQuery: GetThreadListQuery,
		private readonly getThreadQuery: GetThreadQuery,
		private readonly getMessageListQuery: GetMessageListQuery,
		private readonly getMessageQuery: GetMessageQuery,
		private readonly createMessageCommand: CreateMessageCommand,
		private readonly updateLastMessageSeenAtCommand: UpdateLastMessageSeenAtCommand,
		private readonly messageGateway: MessageGateway,
	) {
	}

	@Get('/thread')
	@UseGuards(AuthGuard('jwt'))
	async getThreadList(
		@AuthUser() user: User,
	) {
		return await this.getThreadListQuery.execute({
			userId: user.id,
		});
	}

	@Get('/thread/:id')
	@UseGuards(AuthGuard('jwt'))
	async getThreadMessageList(
		@AuthUser() user: User,
		@Param('id') id: string,
		@Query() pagination: PaginationDto,
	) {
		if (!pagination.limit) {
			pagination.limit = MessageController.MESSAGE_LIST_DEFAULT_LIMIT;
		}

		return await this.getMessageListQuery.execute({
			threadId: id,
			userId: user.id,
			pagination,
		});
	}

	@Get('/:id')
	@UseGuards(AuthGuard('jwt'))
	async getMessage(
		@AuthUser() user: User,
		@Param('id') id: string,
	) {
		const result = await this.getMessageQuery.execute({
			id,
			userId: user.id,
		});

		if (!result.message) {
			throw new NotFoundException();
		}

		return result;
	}

	@Post('')
	@UseGuards(AuthGuard('jwt'))
	async createMessage(
		@AuthUser() user: User,
		@Body() messageDto: object,
	) {
		const commandData = plainToClass(CreateMessageCommandData, messageDto);

		// check that logged in user is part of the message
		if (commandData.fromId !== user.id && commandData.toId !== user.id) {
			throw new ForbiddenException();
		}

		const messageResult = await this.createMessageCommand.execute(commandData);

		if (!!messageResult.validationResult) {
			throw new UnprocessableEntityException(messageResult.validationResult);
		}

		// dispatch message via websockets
		this.messageGateway.sendMessage!(messageResult.message);

		// fetch and return response data
		const threadResult = await this.getThreadQuery.execute({
			id: messageResult.message.threadId,
			userId: user.id,
		});

		return {
			message: messageResult.message,
			thread: threadResult.thread,
		};
	}

	@Post('seen')
	@UseGuards(AuthGuard('jwt'))
	async updateLastMessageSeenAt(
		@AuthUser() user: User,
		@Body() updateDto: object,
	) {
		const commandData = plainToClass(UpdateLastMessageSeenAtCommandData, updateDto);
		commandData.userId = user.id;

		const result = await this.updateLastMessageSeenAtCommand.execute(commandData);

		if (!!result.validationResult) {
			throw new UnprocessableEntityException(result.validationResult);
		}

		return await this.getThreadQuery.execute({
			id: commandData.threadId,
			userId: user.id,
		});
	}

}
