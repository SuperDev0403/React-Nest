import { Message } from '../model/message.entity';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, validate } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { plainToClass, Type } from 'class-transformer';
import { MessageEntityRepository } from '../repository/message.entity.repository';
import { ValidationResult } from '../../../lib/validator/model/validation.result';
import { MessageType } from '../model/message.type';
import { MessagePayload } from '../model/message.payload.entity';
import { UserEntityRepository } from '../../user/repository/user.entity.repository';
import { MessagePayloadFactory } from '../factory/model/message.payload.factory';

export class CreateMessageCommandData implements Partial<Message>, Partial<MessagePayload> {
	@IsEnum(MessageType, {always: true})
	@IsNotEmpty({always: true})
	type: MessageType;

	@IsNotEmpty({always: true})
	@IsUUID(undefined, {always: true})
	fromId: string;

	@IsNotEmpty({always: true})
	@IsUUID(undefined, {always: true})
	toId: string;

	@IsNotEmpty({groups: [MessageType.TEXT]})
	@IsString({groups: [MessageType.TEXT]})
	text?: string;

	@IsNotEmpty({groups: [MessageType.CALL]})
	@IsDate({groups: [MessageType.CALL]})
	@Type(() => Date)
	startAt?: Date;

	@IsOptional({always: true})
	@IsDate({groups: [MessageType.CALL]})
	@Type(() => Date)
	endAt?: Date;

	@IsNotEmpty({groups: [MessageType.IMAGE]})
	@IsString({groups: [MessageType.IMAGE]})
	imageUrl?: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	seenAt?: Date;
}

export class CreateMessageCommandResult {
	message?: Message;
	validationResult?: ValidationResult;
}

@Injectable()
export class CreateMessageCommand {

	constructor(
		private readonly messageRepository: MessageEntityRepository,
		private readonly userRepository: UserEntityRepository,
	) {
	}

	async execute(data: CreateMessageCommandData): Promise<CreateMessageCommandResult> {
		const validationResult = await this.validateData(data);

		if (!!validationResult) {
			return plainToClass(CreateMessageCommandResult, {validationResult});
		}

		let message = plainToClass(Message, {
			type: data.type,
			fromId: data.fromId,
			toId: data.toId,
			seenAt: data.seenAt,
		});

		message.threadId = Message.createThreadId(message.fromId, message.toId);
		message.payload = MessagePayloadFactory.createFromObject(data, data.type);

		message = await this.messageRepository.save(message);
		message = await this.messageRepository.findOneBy({id: message.id});

		return plainToClass(CreateMessageCommandResult, {message});
	}

	async validateData(data: CreateMessageCommandData): Promise<ValidationResult | undefined> {
		// validate basic data
		let result = await validate(data, {groups: ['default']});

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		// validate message type specific data
		result = await validate(data, {groups: [data.type]});

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		// validate users exist
		const userIdList = [data.fromId, data.toId];
		const userList = await this.userRepository.findBy({
			idList: userIdList,
		});

		if (userList.length !== 2) {
			const userIdMap = userList.reduce((carry, item) => {
				carry[item.id] = item;
				return carry;
			}, {});

			const missingUserIdList = userIdList.filter(id => !userIdMap[id]);

			return ValidationResult.create({
				errorMessage: `User with ID "${missingUserIdList.join(', ')}" does not exist`,
			});
		}

		return undefined;
	}

}
