import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Twilio } from 'twilio';
import { MessageType } from '../../core/message/model/message.type';
import { GetMessageListQuery } from '../../core/message/query/get.message.list.query';
import { User } from '../../core/user/model/user.entity';
import { AuthUser } from '../auth/auth.decorator';
import { PaginationDto } from '../lib/dto/pagination.dto';

@Controller('call')
export class CallController {

	static MESSAGE_LIST_DEFAULT_LIMIT = 100;

	constructor(
		private readonly twilio: Twilio,
		private readonly getMessageListQuery: GetMessageListQuery,
	) {
	}

	@Get('/history')
	@UseGuards(AuthGuard('jwt'))
	async getCallHistory(
		@AuthUser() user: User,
		@Query() pagination: PaginationDto,
	) {
		if (!pagination.limit) {
			pagination.limit = CallController.MESSAGE_LIST_DEFAULT_LIMIT;
		}

		return await this.getMessageListQuery.execute({
			userId: user.id,
			pagination,
			typeList: [MessageType.CALL],
		});
	}

	@Get('/peer-connection/config')
	@UseGuards(AuthGuard('jwt'))
	async getPeerConnectionConfig() {
		const config = await this.twilio.tokens.create();
		return {iceServers: config.iceServers};
	}

}
