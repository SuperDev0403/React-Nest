import { AppState, INITIAL_STATE } from './app.state';
import { createReducer } from '@reduxjs/toolkit';
import { bootstrapResult } from './app.action';

export const appReducer = createReducer(INITIAL_STATE, builder => {

	builder.addCase(bootstrapResult, (state: AppState, action) => {
		if (action.error) {
			return {hasBootstrapped: false, error: action.payload};
		}

		return {hasBootstrapped: true};
	});

});
