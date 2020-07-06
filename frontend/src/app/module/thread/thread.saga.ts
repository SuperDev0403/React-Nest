import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { Thread } from '../../../api/model/message';
import { updateLastMessageSeenAtRequest, updateLastMessageSeenAtResult } from './thread.action';
import { updateLastMessageSeenAt } from '../../../api/sdk/message/update.last.message.seen.at';

export function* updateThreadLastMessageSeenAt(action: PayloadAction<Thread>) {
	let response = yield call(updateLastMessageSeenAt, {
		seenAt: new Date(),
		threadId: action.payload.id,
	});

	if ('thread' in response) {
		yield put(updateLastMessageSeenAtResult(response));
	}
}

export function* threadSaga() {
	yield takeLeading(updateLastMessageSeenAtRequest.type, updateThreadLastMessageSeenAt);
}
