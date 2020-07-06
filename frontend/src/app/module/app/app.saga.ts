import { call, put, takeEvery } from 'redux-saga/effects';
import { bootstrapRequest, bootstrapResult } from './app.action';
import { authorizeUser } from '../auth/auth.saga';

export function* bootstrap() {
	let bootstrapError;

	try {
		yield call(authorizeUser);
	} catch (error) {
		bootstrapError = error;
	}

	yield put(bootstrapResult(bootstrapError));
}

export function* appSaga() {
	yield takeEvery(bootstrapRequest.type, bootstrap);
}
