import { Body, Controller, Get, Post, Query, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { CreateUserCommand, CreateUserCommandData } from '../../core/user/command/create.user.command';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './auth.decorator';
import { User } from '../../core/user/model/user.entity';
import { ResetPasswordCommand, ResetPasswordCommandData } from '../../core/user/command/reset.password.command';
import { UpdatePasswordCommand, UpdatePasswordCommandData } from '../../core/user/command/update.password.command';

@Controller('auth')
export class AuthController {

	constructor(
		private readonly createUserCommand: CreateUserCommand,
		private readonly resetPasswordCommand: ResetPasswordCommand,
		private readonly updatePasswordCommand: UpdatePasswordCommand,
		private readonly authService: AuthService,
	) {
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(
		@AuthUser() user: User,
	) {
		return this.authService.createSession(user);
	}

	@Post('logout')
	async logout() {
		return null;
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('token')
	async token(
		@AuthUser() user: User,
	) {
		return this.authService.refreshSession(user);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('info')
	async info(
		@AuthUser() user: User,
	) {
		return {user};
	}

	@Post('register')
	async registerUser(
		@Body() userDto: object,
		@Query('authenticate') authenticate?: string,
	) {
		const commandData = plainToClass(CreateUserCommandData, userDto);
		const commandResult = await this.createUserCommand.execute(commandData);

		if (!!commandResult.validationResult) {
			throw new UnprocessableEntityException(commandResult.validationResult);
		}

		if (!authenticate) {
			return {};
		}

		return this.authService.createSession(commandResult.user);
	}

	@Post('password/reset')
	async resetPassword(
		@Body() resetPasswordDto: object,
	) {
		const commandData = plainToClass(ResetPasswordCommandData, resetPasswordDto);
		const commandResult = await this.resetPasswordCommand.execute(commandData);

		if (commandResult.validationResult) {
			throw new UnprocessableEntityException(commandResult.validationResult);
		}

		return null;
	}

	@Post('password')
	async updatePassword(
		@Body() updatePasswordDto: object,
	) {
		const commandData = plainToClass(UpdatePasswordCommandData, updatePasswordDto);
		const commandResult = await this.updatePasswordCommand.execute(commandData);

		if (!!commandResult.validationResult) {
			throw new UnprocessableEntityException(commandResult.validationResult);
		}

		return null;
	}

}
