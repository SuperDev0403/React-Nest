import { IsDate, IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { plainToClass, Type } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../model/message.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ValidationResult } from '../../../lib/validator/model/validation.result';

export class UpdateLastMessageSeenAtCommandData {
	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	seenAt: Date;

	@IsString()
	@IsNotEmpty()
	threadId: string;

	@IsString()
	@IsUUID()
	@IsNotEmpty()
	userId: string;
}

export class UpdateLastMessageSeenAtCommandResult {
	validationResult?: ValidationResult;
}

@Injectable()
export class UpdateLastMessageSeenAtCommand {

	constructor(
		@InjectRepository(Message) protected readonly repository: Repository<Message>,
	) {
	}

	async execute(data: UpdateLastMessageSeenAtCommandData): Promise<UpdateLastMessageSeenAtCommandResult> {
		const validationResult = await this.validateData(data);

		if (!!validationResult) {
			return plainToClass(UpdateLastMessageSeenAtCommandResult, {validationResult});
		}

		const qb = this.repository
			.createQueryBuilder('message')
			.update();

		qb.set({seenAt: data.seenAt});
		qb.where('threadId = :threadId', {threadId: data.threadId});
		qb.andWhere('seenAt IS NULL');
		qb.andWhere('createdAt <= :seenAt', {seenAt: data.seenAt});
		qb.andWhere('toId = :userId', {userId: data.userId});

		await qb.execute();

		return plainToClass(UpdateLastMessageSeenAtCommandResult, {});
	}

	async validateData(data: UpdateLastMessageSeenAtCommandData): Promise<ValidationResult | undefined> {
		const result = await validate(data);

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		// check that the thread exists
		const threadMessageCount = await this.repository.count({
			where: {threadId: data.threadId},
		});

		if (threadMessageCount <= 0) {
			return ValidationResult.create({
				errorMessage: `Thread with ID "${data.threadId}" does not exist`,
			});
		}
	}

}
