import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	UnprocessableEntityException,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUserQuery } from '../../core/user/query/get.user.query';
import { GetUserListQuery } from '../../core/user/query/get.user.list.query';
import { AuthUser } from '../auth/auth.decorator';
import { User } from '../../core/user/model/user.entity';
import { plainToClass } from 'class-transformer';
import { AddUserContactCommand, AddUserContactCommandData } from '../../core/user/command/add.user.contact.command';
import { GetUserContactListQuery } from '../../core/user/query/get.user.contact.list.query';
import { UpdateUserCommand, UpdateUserCommandData } from '../../core/user/command/update.user.command';

@Controller('user')
export class UserController {

	constructor(
		private readonly getUserQuery: GetUserQuery,
		private readonly getUserListQuery: GetUserListQuery,
		private readonly getUserContactListQuery: GetUserContactListQuery,
		private readonly addUserContactCommand: AddUserContactCommand,
		private readonly updateUserCommand: UpdateUserCommand,
	) {
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async getOwnUser(
		@AuthUser() me: User,
	) {
		return {user: me};
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('me')
	async updateOwnUser(
		@AuthUser() me: User,
		@Body() userDto: object,
	) {
		const commandData = plainToClass(UpdateUserCommandData, userDto);
		const commandResult = await this.updateUserCommand.execute(me, commandData);

		if (!!commandResult.validationResult) {
			throw new UnprocessableEntityException(commandResult.validationResult);
		}
		return commandResult;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':id')
	async getUserById(
		@Param('id') id: string,
	) {
		const result = await this.getUserQuery.execute({id});

		if (!result.user) {
			throw new NotFoundException();
		}

		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me/contact')
	async getContactList(
		@AuthUser() me: User,
	) {
		return await this.getUserContactListQuery.execute({
			userId: me.id,
		});
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('me/contact')
	async addContact(
		@AuthUser() me: User,
		@Body() requestDto: object,
	) {
		const commandData = plainToClass(AddUserContactCommandData, requestDto);
		commandData.userId = me.id;

		const commandResult = await this.addUserContactCommand.execute(commandData);

		if (commandResult.validationResult) {
			throw new UnprocessableEntityException(commandResult.validationResult);
		}

		return commandResult;
	}

}
