import { AnyAction, Middleware } from 'redux';
import * as wsAction from './ws.action';
import { createSocket, Ws } from '../../../api/sdk-ws/sdk.ws';

export const createWsMiddleware = (): Middleware => {
	let socket: Ws;

	return (store) => {

		async function connect() {
			socket = await createSocket();
			socket.on('connect', () => {
				store.dispatch(wsAction.connectResult());
			});
			socket.on('connect_error', (error: any) => {
				store.dispatch(wsAction.connectResult(error));
			});
			socket.on('close', () => {
				store.dispatch(wsAction.closeResult());
			});
		}

		async function close() {
			!!socket && socket.close();
		}

		async function subscribeTo(event: string) {
			if (!socket) {
				return;
			}

			const isSubscribed = !!socket.listeners(event).find(l => l === handleEvent);

			if (!isSubscribed) {
				socket.addEventListener('event', handleEvent);
			}
		}

		async function emit(event: string, data: any) {
			if (!socket) {
				return;
			}
			socket.emit(event, data);
		}

		function handleEvent(event: string, data: any) {
			store.dispatch(wsAction.event(event, data));
		}

		return (next) => (action: AnyAction) => {
			if (wsAction.connectRequest.match(action)) {
				connect!();
			} else if (wsAction.closeRequest.match(action)) {
				close!();
			} else if (wsAction.subscribeRequest.match(action)) {
				subscribeTo!(action.payload);
			} else if (wsAction.emitRequest.match(action)) {
				emit!(action.payload.event, action.payload.data);
			}

			return next(action);
		};
	};
};
