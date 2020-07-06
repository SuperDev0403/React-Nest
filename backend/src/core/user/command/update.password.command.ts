import { UserEntityRepository } from '../repository/user.entity.repository';
import { User } from '../model/user.entity';
import { IsNotEmpty, IsString, Length, validate } from 'class-validator';
import { ValidationResult } from '../../../lib/validator/model/validation.result';
import { BCryptPasswordEncoder } from '../../../lib/security/encoder/bcrypt.password.encoder';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';

export class UpdatePasswordCommandData {
	@IsString()
	@IsNotEmpty()
	confirmationToken: string;

	@IsString()
	@Length(10)
	@IsNotEmpty()
	plainPassword: string;
}

export class UpdatePasswordCommandResult {
	user?: User;
	validationResult?: ValidationResult;
}

@Injectable()
export class UpdatePasswordCommand {

	constructor(
		private readonly userRepository: UserEntityRepository,
		protected readonly passwordEncoder: BCryptPasswordEncoder,
	) {
	}

	async execute(data: UpdatePasswordCommandData): Promise<UpdatePasswordCommandResult> {
		// find user by confirmation token
		let user = await this.userRepository.findOneBy({confirmationToken: data.confirmationToken});

		// validate
		const validationResult = await this.validate(user, data);

		if (!!validationResult) {
			return plainToClass(UpdatePasswordCommandResult, {validationResult});
		}

		// set new password and remove reset PW confirm token
		user.password = await this.passwordEncoder.encode(data.plainPassword);
		user.confirmationToken = null;

		// save user and remove credentials
		user = await this.userRepository.save(user);
		delete user.password;

		return plainToClass(UpdatePasswordCommandResult, {user});
	}

	async validate(user: User | undefined, data: UpdatePasswordCommandData): Promise<ValidationResult | undefined> {
		if (!user) {
			return ValidationResult.create({errorMessage: `User not found`});
		}

		const result = await validate(data);

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		return undefined;
	}

}
