import { createReducer } from '@reduxjs/toolkit';

import { INITIAL_STATE, WsState } from './ws.state';
import { closeResult, connectResult } from './ws.action';

export const wsReducer = createReducer<WsState>(INITIAL_STATE, (builder) => {

	builder.addCase(connectResult, (state, action) => {
		state.isConnected = !action.error;
		state.connectionError = action.payload;
	});

	builder.addCase(closeResult, (state, action) => {
		state.isConnected = false;
		state.connectionError = undefined;
	});

});
