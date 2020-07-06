import { UserEntityRepository } from '../repository/user.entity.repository';
import { User } from '../model/user.entity';
import * as cryptoRandomString from 'crypto-random-string';
import { IsEmail, IsNotEmpty, IsString, validate } from 'class-validator';
import { ValidationResult } from '../../../lib/validator/model/validation.result';
import { plainToClass } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import * as Mail from 'nodemailer/lib/mailer';

export class ResetPasswordCommandData {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;
}

export class ResetPasswordCommandConfig {
	resetPasswordUrl: string;
}

export class ResetPasswordCommandResult {
	validationResult?: ValidationResult;
}

@Injectable()
export class ResetPasswordCommand {

	constructor(
		private readonly userRepository: UserEntityRepository,
		@Inject('mailer') private readonly mailer: Mail,
		private readonly config: ResetPasswordCommandConfig,
	) {
	}

	async execute(data: ResetPasswordCommandData): Promise<ResetPasswordCommandResult> {
		// validate
		const validationResult = await this.validate(data);

		if (!!validationResult) {
			return plainToClass(ResetPasswordCommandResult, {validationResult});
		}

		// fetch user
		let user = await this.userRepository.findOneBy({email: data.email});

		if (!user) {
			return plainToClass(ResetPasswordCommandResult, {});
		}

		// create pw reset confirmation token for user
		user.confirmationToken = await this.createConfirmationToken();
		user = await this.userRepository.save(user);

		// send email
		this.sendResetPasswordEmail(user);

		return plainToClass(ResetPasswordCommandResult, {});
	}

	async createConfirmationToken(): Promise<string> {
		return cryptoRandomString({length: 32, type: 'url-safe'});
	}

	async sendResetPasswordEmail(user: User): Promise<void> {
		const url = this.config.resetPasswordUrl.replace(':token', user.confirmationToken);

		const html = `
<div>
    <p>Please click on link bellow to reset your password:</p>
    <a href="${url}">${url}</a>
</div>
`;

		try {
			await this.mailer.sendMail({
				from: 'no-reply@skytech.com',
				to: user.email,
				subject: 'Reset you password',
				html,
			});
		} catch (e) {
			// tslint:disable-next-line:no-console
			console.error(e);
		}
	}

	async validate(data: ResetPasswordCommandData): Promise<ValidationResult | undefined> {
		const result = await validate(data);

		if (result.length > 0) {
			return ValidationResult.create({errorList: result});
		}

		return undefined;
	}

}
