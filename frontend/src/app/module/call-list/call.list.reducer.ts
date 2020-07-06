import { createReducer } from '@reduxjs/toolkit';
import { fetchCallListResult } from './call.list.action';
import { INITIAL_STATE } from './call.list.state';

export const callListReducer = createReducer(INITIAL_STATE, (builder) => {

	builder.addCase(fetchCallListResult, (state, action) => {
		state.itemList = action.payload.result;
	});

});
