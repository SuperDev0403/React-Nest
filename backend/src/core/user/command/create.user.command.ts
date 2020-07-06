import { User } from '../model/user.entity';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, validate } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntityRepository } from '../repository/user.entity.repository';
import { ValidationResult } from '../../../lib/validator/model/validation.result';
import { BCryptPasswordEncoder } from '../../../lib/security/encoder/bcrypt.password.encoder';

export class CreateUserCommandData implements Partial<User> {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@Length(10)
	@IsNotEmpty()
	plainPassword: string;

	@IsString()
	@IsNumberString()
	@IsNotEmpty()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	imageUrl?: string;
}

export class CreateUserCommandResult {
	user?: User;
	validationResult?: ValidationResult;
}

@Injectable()
export class CreateUserCommand {

	constructor(
		private readonly userRepository: UserEntityRepository,
		protected readonly passwordEncoder: BCryptPasswordEncoder,
	) {
	}

	async execute(data: CreateUserCommandData): Promise<CreateUserCommandResult> {
		// validate
		const validationResult = await this.validate(data);

		if (!!validationResult) {
			return plainToClass(CreateUserCommandResult, {validationResult});
		}

		// create user and normalize data
		let user = plainToClass(User, data);
		user.email = user.email.toLowerCase();
		user.password = await this.passwordEncoder.encode(data.plainPassword);

		// save user and remove credentials data
		user = await this.userRepository.save(user);
		delete user.password;

		return plainToClass(CreateUserCommandResult, {user});
	}

	async validate(data: CreateUserCommandData): Promise<ValidationResult | undefined> {
		const result = await validate(data);

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		// check if user with same email or phone number already exists
		const existingUserList = await Promise.all([
			this.userRepository.findOneBy({email: data.email}),
			this.userRepository.findOneBy({emailOrPhone: data.phoneNumber}),
		]);

		if (!!existingUserList[0]) {
			return ValidationResult.create({errorMessage: `User with email "${data.email}" already exist`});
		}
		if (!!existingUserList[1]) {
			return ValidationResult.create({errorMessage: `User with phone number "${data.phoneNumber}" already exist`});
		}

		return undefined;
	}

}
