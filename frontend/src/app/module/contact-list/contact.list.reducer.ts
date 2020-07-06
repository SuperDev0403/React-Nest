import { createReducer } from '@reduxjs/toolkit';
import { INITIAL_STATE } from './contact.list.state';
import { addContactResult, fetchContactListResult } from './contact.list.action';

export const contactListReducer = createReducer(INITIAL_STATE, (builder) => {

	builder.addCase(fetchContactListResult, (state, action) => {
		state.itemList = action.payload.result;
	});

	builder.addCase(addContactResult, (state, action) => {
		if (!state.itemList) {
			state.itemList = [];
		}

		if (!state.itemList?.includes(action.payload.result)) {
			state.itemList?.unshift(action.payload.result);
		}
	});

});
