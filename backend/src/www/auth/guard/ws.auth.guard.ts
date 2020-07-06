import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') {

	getRequest(context: ExecutionContext) {
		return context.switchToWs().getClient<Socket>().handshake;
	}

	handleRequest(err, user, info, context) {
		try {
			return super.handleRequest(err, user, info, context);
		} catch (e) {
			if (!(e instanceof HttpException)) {
				throw e;
			}

			throw new WsException(e.getResponse());
		}
	}

}
