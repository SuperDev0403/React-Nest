import { createAction } from '@reduxjs/toolkit';
import { User } from '../../../api/model/user';

export const startCallRequest = createAction('call/start_request', (user: User) => {
	return {payload: user};
});

export const startCallResult = createAction('call/start_result');

export const receiveCallRequest = createAction('call/receive_request', (user: User) => {
	return {payload: user};
});

export const receiveCallResult = createAction('call/receive_result');
