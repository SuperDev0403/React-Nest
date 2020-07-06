import { WsUserRegistry } from '../../core/user/ws/ws.user.registry';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { User } from '../../core/user/model/user.entity';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { UserEntityRepository } from '../../core/user/repository/user.entity.repository';
import { Debugger } from 'debug';
import { GetUserContactListQuery } from '../../core/user/query/get.user.contact.list.query';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly wsUserRegistry: WsUserRegistry,
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		private readonly userRepository: UserEntityRepository,
		private readonly getUserContactListQuery: GetUserContactListQuery,
		@Inject('debug') private readonly debug: Debugger,
	) {
		this.debug = debug.extend('gateway:user');
	}

	async handleConnection(client: Socket) {
		this.debug('handleConnection %O', this.wsUserRegistry);

		// make sure client is authorized
		const isAuthorized = await this.authorizeClient(client);
		if (!isAuthorized) {
			client.emit('exception', new WsException((new UnauthorizedException()).getResponse()));
			return;
		}

		// fetch user's contact list
		const user = (client as any).user as User;
		const {contactList} = await this.getUserContactListQuery.execute({userId: user.id});

		// broadcast user's online status to all contacts
		await this.broadcastUserOnlineStatus(client, user, contactList, {isOnline: true});

		// send to user who of his contacts is online
		await this.sendContactListOnlineStatus(client, user, contactList);

		this.debug('handleConnection:done %O', this.wsUserRegistry);
	}

	async handleDisconnect(client: Socket) {
		this.debug('handleDisconnect %O', this.wsUserRegistry);

		// fetch user's contact list
		const user = (client as any).user as User;
		const {contactList} = await this.getUserContactListQuery.execute({userId: user.id});

		// broadcast user's offline status to all contacts
		this.wsUserRegistry.delete(client.id);
		await this.broadcastUserOnlineStatus(client, user, contactList, {isOnline: false});

		this.debug('handleDisconnect:done %O', this.wsUserRegistry);
	}

	/*
	 * Helpers
	 */
	private async sendContactListOnlineStatus(client: Socket, user: User, contactList: User[]) {
		for (const contact of contactList) {
			if (!this.wsUserRegistry.hasUser(contact.id)) {
				continue;
			}

			client.emit('user/status', {
				id: contact.id,
				isOnline: true,
			});
		}
	}

	private async broadcastUserOnlineStatus(client: Socket, user: User, contactList: User[], {isOnline}) {
		for (const contact of contactList) {
			if (!this.wsUserRegistry.hasUser(contact.id)) {
				continue;
			}

			const socketIdList = this.wsUserRegistry.getSocketList(contact.id);

			for (const socketId of socketIdList) {
				this.server.to(socketId).emit('user/status', {
					id: user.id,
					isOnline,
				});
			}
		}
	}

	private async authorizeClient(client: Socket): Promise<boolean> {
		const {accessToken} = client.handshake.query;
		let jwt;

		try {
			jwt = await this.jwtService.verifyAsync(accessToken);
		} catch (error) {
			return false;
		}

		const user = await this.authService.authorizeJwt(jwt);

		if (!user) {
			return false;
		}

		(client as any).user = user;
		this.wsUserRegistry.set(client.id, user.id);

		return true;
	}
}
