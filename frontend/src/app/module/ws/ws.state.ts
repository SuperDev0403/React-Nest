export interface WithWsState {
	ws: WsState;
}

export interface WsState {
	isConnected: boolean,
	connectionError?: Error,
}

export const INITIAL_STATE: WsState = {
	isConnected: false,
};
