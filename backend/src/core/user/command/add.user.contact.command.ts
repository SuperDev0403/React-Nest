import { User } from '../model/user.entity';
import { ValidationResult } from '../../../lib/validator/model/validation.result';
import { plainToClass } from 'class-transformer';
import { UserEntityRepository } from '../repository/user.entity.repository';
import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { CreateUserCommandResult } from './create.user.command';
import { UserContactEntityRepository } from '../repository/user.contact.entity.repository';
import { UserContact } from '../model/user.contact.entity';

export class AddUserContactCommandData {
	@IsNotEmpty()
	@IsString()
	emailOrPhone: string;

	@IsNotEmpty()
	@IsString()
	@IsUUID()
	userId: string;
}

export class AddUserContactCommandResult {
	user?: User;
	contact?: User;
	validationResult?: ValidationResult;
}

@Injectable()
export class AddUserContactCommand {

	constructor(
		private readonly userRepository: UserEntityRepository,
		private readonly userContactRepository: UserContactEntityRepository,
	) {
	}

	async execute(data: AddUserContactCommandData): Promise<AddUserContactCommandResult> {
		/*
		 * validate
		 */
		let validationResult = await this.validate(data);

		if (!!validationResult) {
			return plainToClass(CreateUserCommandResult, {validationResult});
		}

		/*
		 * Load user
		 */
		const user = await this.userRepository.findOneBy({
			id: data.userId,
		});

		if (!user) {
			validationResult = ValidationResult.create({
				errorMessage: `No user found with ID "${data.userId}"`,
			});
			return plainToClass(AddUserContactCommandResult, {validationResult});
		}

		/*
		 * Load contact user
		 */
		const contact = await this.userRepository.findOneBy({emailOrPhone: data.emailOrPhone});

		if (!contact) {
			validationResult = ValidationResult.create({
				errorMessage: `No user found with email or phone "${data.emailOrPhone}"`,
			});
			return plainToClass(AddUserContactCommandResult, {validationResult});
		}

		/*
		 * Check if it's me
		 */
		if (contact.id === user.id) {
			validationResult = ValidationResult.create({
				errorMessage: `Cannot add yourself as contact`,
			});
			return plainToClass(AddUserContactCommandResult, {validationResult});
		}

		/*
		 * Add to contact if not there already
		 */
		const existingContact = await this.userContactRepository.findOneForUsers({
			user1Id: user.id,
			user2Id: contact.id,
		});

		if (!existingContact) {
			const userContact = plainToClass(UserContact, {
				user1Id: user.id,
				user2Id: contact.id,
			});

			await this.userContactRepository.save(userContact);
		}

		return plainToClass(AddUserContactCommandResult, {
			user,
			contact,
		});
	}

	async validate(data: AddUserContactCommandData): Promise<ValidationResult | undefined> {
		const result = await validate(data);

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}
	}

}
