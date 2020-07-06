import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchContactListRequest, fetchContactListResult } from './contact.list.action';
import { getContactList } from '../../../api/sdk/user/get.contact.list';

export function* fetchContactList() {
	let response = yield call(getContactList);
	yield put(fetchContactListResult(response.contactList));
}

export function* contactListSaga() {
	yield takeEvery(fetchContactListRequest.type, fetchContactList);
}
