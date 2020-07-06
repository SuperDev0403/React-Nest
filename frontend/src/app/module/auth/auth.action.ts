import { createAction } from '@reduxjs/toolkit';
import { User } from '../../../api/model/user';
import { normalize } from 'normalizr';
import { UserSchema } from '../user/user.schema';

export const authorizationRequest = createAction('auth/authorization_request');
export const authorizationResult = createAction('auth/authorization_result', (user: User | undefined) => {
	if (!user) {
		return {payload: undefined};
	}

	const payload = normalize(user, UserSchema);
	return {payload};
});

export const logoutRequest = createAction('auth/logout_request');
export const logoutResult = createAction('auth/logout_result');
