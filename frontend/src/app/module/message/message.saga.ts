import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { createMessageRequest, createMessageResult } from './message.action';
import { createMessage, CreateMessageRequest } from '../../../api/sdk/message/create.message';

export function* createMessageSaga(action: PayloadAction<CreateMessageRequest>) {
	const data = action.payload;
	try {
		const response = yield call(createMessage, data);
		yield put(createMessageResult(response));
	} catch (e) {
		console.error(e);
	}
}

export function* messageSaga() {
	yield takeLeading(createMessageRequest.type, createMessageSaga);
}
