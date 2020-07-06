import { call, put, takeLeading } from 'redux-saga/effects';
import { fetchMessageListRequest, fetchMessageListResult } from './message.list.action';
import { getMessageList } from '../../../api/sdk/message/get.message.list';
import { PayloadAction } from '@reduxjs/toolkit';
import { Thread } from '../../../api/model/message';

export function* fetchMessageList(action: PayloadAction<Thread>) {
	const data = {threadId: action.payload.id};
	const response = yield call(getMessageList, data);

	yield put(fetchMessageListResult(response, action.payload));
}

export function* messageListSaga() {
	yield takeLeading(fetchMessageListRequest.type, fetchMessageList);
}
