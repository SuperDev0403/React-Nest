import { createReducer } from '@reduxjs/toolkit';
import { INITIAL_STATE } from './message.list.state';
import { fetchMessageListResult } from './message.list.action';
import { createMessageResult } from '../message/message.action';

export const messageListReducer = createReducer(INITIAL_STATE, (builder) => {

	builder.addCase(fetchMessageListResult, (state, action) => {
		const thread = action.meta.thread;
		const {result: itemList, totalItemCount} = action.payload;
		const userId = thread.user.id;

		if (!state[userId]) {
			state[userId] = {};
		}

		state[userId].itemList = itemList.reverse();
		state[userId].totalItemCount = totalItemCount;
	});

	builder.addCase(createMessageResult, (state, action) => {
		if (!('result' in action.payload)) {
			return;
		}

		const {thread} = (action as any).meta;
		const userId = thread.user.id;

		if (!state[userId]) {
			state[userId] = {
				itemList: [],
				totalItemCount: 0,
			};
		}

		state[userId].itemList?.push(action.payload.result.message);
		state[userId].totalItemCount! += 1;
	});

});
