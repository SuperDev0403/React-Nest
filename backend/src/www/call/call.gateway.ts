import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../auth/guard/ws.auth.guard';
import { Debugger } from 'debug';

/*
 * Call WS Gateway
 *
 * Acts as a relay between two users who wish to establish a call
 */
@WebSocketGateway()
export class CallGateway {

	constructor(
		@Inject('debug') private readonly debug: Debugger,
	) {
		this.debug = debug.extend('gateway:call');
	}

	@SubscribeMessage('call/start')
	@UseGuards(WsAuthGuard)
	async onCallStart(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/start %O', data);
		socket.broadcast.emit('call/start', data);
	}

	@SubscribeMessage('call/signal')
	@UseGuards(WsAuthGuard)
	async onCallSignal(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/signal %O', data);
		socket.broadcast.emit('call/signal', data);
	}

	@SubscribeMessage('call/accept')
	@UseGuards(WsAuthGuard)
	async onCallAccept(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/accept %O', data);
		socket.broadcast.emit('call/accept', data);
	}

	@SubscribeMessage('call/reject')
	@UseGuards(WsAuthGuard)
	async onCallReject(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/reject %O', data);
		socket.broadcast.emit('call/reject', data);
	}

	@SubscribeMessage('call/end')
	@UseGuards(WsAuthGuard)
	async onCallEnd(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/end %O', data);
		socket.broadcast.emit('call/end', data);
	}

	@SubscribeMessage('call/screenshot')
	@UseGuards(WsAuthGuard)
	async onCallScreenshot(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/screenshot %O', data);
		socket.broadcast.emit('call/screenshot', data);
	}

	@SubscribeMessage('call/screenshot-request')
	@UseGuards(WsAuthGuard)
	async onCallScreenshotRequest(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/screenshot-request %O', data);
		socket.broadcast.emit('call/screenshot-request', data);
	}

	@SubscribeMessage('call/screenshot/annotation')
	@UseGuards(WsAuthGuard)
	async onCallScreenshotAnnotation(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: any,
	) {
		this.debug('call/screenshot/annotation %O', data);
		socket.broadcast.emit('call/screenshot/annotation', data);
	}

}
