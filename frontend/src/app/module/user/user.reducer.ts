import { createReducer } from '@reduxjs/toolkit';
import { updateUserStatus } from './user.action';
import { INITIAL_STATE, UserState } from './user.state';

export const userReducer = createReducer<UserState>(INITIAL_STATE, (builder) => {

	builder.addCase(updateUserStatus, (state, action) => {
		const user = action.payload;

		if (!state[user.id]) {
			state[user.id] = {};
		}

		state[user.id]!.isOnline = user.isOnline;
		state[user.id]!.isBusy = user.isBusy;
	});

});
