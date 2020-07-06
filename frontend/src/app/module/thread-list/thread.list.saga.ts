import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchThreadListRequest, fetchThreadListResult } from './thread.list.action';
import { getThreadList } from '../../../api/sdk/message/get.thread.list';

export function* fetchThreadList() {
	let response = yield call(getThreadList);
	yield put(fetchThreadListResult(response.threadList));
}

export function* threadListSaga() {
	yield takeEvery(fetchThreadListRequest.type, fetchThreadList);
}
