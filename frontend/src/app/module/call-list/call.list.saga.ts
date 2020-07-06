import { call, put, takeEvery } from 'redux-saga/effects';
import { getCallHistory } from '../../../api/sdk/call/get.call.history';
import { fetchCallListRequest, fetchCallListResult } from './call.list.action';

export function* fetchCallList() {
	let response = yield call(getCallHistory, {});
	yield put(fetchCallListResult(response.messageList));
}

export function* callListSaga() {
	yield takeEvery(fetchCallListRequest.type, fetchCallList);
}
