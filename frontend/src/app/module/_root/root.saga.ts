import { all } from 'redux-saga/effects';
import { appSaga } from '../app/app.saga';
import { authSaga } from '../auth/auth.saga';
import { callListSaga } from '../call-list/call.list.saga';
import { contactListSaga } from '../contact-list/contact.list.saga';
import { threadListSaga } from '../thread-list/thread.list.saga';
import { messageListSaga } from '../message-list/message.list.saga';
import { threadSaga } from '../thread/thread.saga';
import { messageSaga } from '../message/message.saga';

export function* rootSaga() {
	yield all([
		appSaga(),
		authSaga(),
		contactListSaga(),
		threadListSaga(),
		messageListSaga(),
		messageSaga(),
		threadSaga(),
		callListSaga(),
	]);
}
