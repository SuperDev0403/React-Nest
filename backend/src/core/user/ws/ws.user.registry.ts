import { User } from '../model/user.entity';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

/*
 * Bi-directional Registry that connects users to the WS sockets they are connected to
 */
@Injectable()
export class WsUserRegistry {

	private socketToUserRegistry = new Map<Socket['id'], User['id']>();

	private userToSocketRegistry = new Map<User['id'], Set<Socket['id']>>();

	hasSocket(socketId: Socket['id']) {
		return !!this.socketToUserRegistry[socketId];
	}

	hasUser(userId: User['id']) {
		return this.userToSocketRegistry.has(userId);
	}

	getUserId(socketId: Socket['id']) {
		return this.socketToUserRegistry.get(socketId);
	}

	getSocketList(userId: User['id']) {
		return this.userToSocketRegistry.get(userId);
	}

	set(socketId: Socket['id'], userId: User['id']) {
		if (
			// socket registered with different user
			this.socketToUserRegistry.has(socketId) && userId !== this.socketToUserRegistry.get(socketId)
		) {
			throw new Error(`Socket with ID "${socketId}" already registered to user ID "${userId}"`);
		}

		this.socketToUserRegistry.set(socketId, userId);

		if (!this.userToSocketRegistry.has(userId)) {
			this.userToSocketRegistry.set(userId, new Set<Socket['id']>());
		}

		this.userToSocketRegistry.get(userId).add(socketId);
	}

	delete(socketId: string) {
		if (!this.socketToUserRegistry.has(socketId)) {
			return;
		}

		const userId = this.socketToUserRegistry.get(socketId);

		this.socketToUserRegistry.delete(socketId);

		if (!this.userToSocketRegistry.has(userId)) {
			return;
		}

		this.userToSocketRegistry.get(userId).delete(socketId);

		if (this.userToSocketRegistry.get(userId).size <= 0) {
			this.userToSocketRegistry.delete(userId);
		}
	}
}
