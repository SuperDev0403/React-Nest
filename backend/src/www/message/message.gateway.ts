import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Debugger } from 'debug';
import { WsUserRegistry } from '../../core/user/ws/ws.user.registry';
import { Message } from '../../core/message/model/message.entity';
import { Server } from 'socket.io';
import { GetThreadQuery } from '../../core/message/query/get.thread.query';

@WebSocketGateway()
export class MessageGateway {

	@WebSocketServer()
	server: Server;

	constructor(
		@Inject('debug') private readonly debug: Debugger,
		private readonly wsUserRegistry: WsUserRegistry,
		private readonly getThreadQuery: GetThreadQuery,
	) {
		this.debug = debug.extend('gateway:message');
	}

	async sendMessage(message: Message): Promise<void> {
		if (!this.wsUserRegistry.hasUser(message.toId)) {
			// TODO: send push notification
			return;
		}

		const {thread} = await this.getThreadQuery.execute({
			id: message.threadId,
			userId: message.toId,
		});

		const socketIdList = this.wsUserRegistry.getSocketList(message.toId);

		for (const socketId of socketIdList) {
			this.server.to(socketId).emit('message/create', {message, thread});
		}
	}

}
