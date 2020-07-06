import { createReducer } from '@reduxjs/toolkit';
import { INITIAL_STATE } from './thread.list.state';
import { fetchThreadListResult } from './thread.list.action';
import { createMessageResult } from '../message/message.action';

export const threadListReducer = createReducer(INITIAL_STATE, (builder) => {

	builder.addCase(fetchThreadListResult, (state, action) => {
		state.itemList = action.payload.result;
	});

	builder.addCase(createMessageResult, (state, action) => {
		if (!state.itemList) {
			state.itemList = [];
		}

		if (!('result' in action.payload)) {
			return;
		}

		if (!state.itemList.includes(action.payload.result.thread)) {
			state.itemList.unshift(action.payload.result.thread);
		}
	});

});
