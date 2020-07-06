import { getAccessToken } from '../auth/token';
import { wsConfig } from '../config/ws.config';
import io from 'socket.io-client';
/// <reference path="socket.io-client" />


export type Ws = SocketIOClient.Socket;

export async function createSocket() {
	const config = {
		...wsConfig,
	};

	const accessToken = getAccessToken();

	const connectOptions: SocketIOClient.ConnectOpts = {
		query: {accessToken},
	};

	return io(config.wsUrl, connectOptions);
}
