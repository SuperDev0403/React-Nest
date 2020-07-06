import { AuthState, INITIAL_STATE } from './auth.state';
import { createReducer } from '@reduxjs/toolkit';
import { authorizationResult, logoutResult } from './auth.action';

export const authReducer = createReducer(INITIAL_STATE, builder => {

	builder.addCase(authorizationResult, (state: AuthState, action) => {
		return {user: action.payload ? action.payload.result : undefined};
	});

	builder.addCase(logoutResult, ((state: AuthState, action) => {
		return {user: undefined};
	}));

});
