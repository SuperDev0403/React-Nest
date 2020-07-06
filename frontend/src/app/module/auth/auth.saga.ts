import { call, put, takeEvery } from 'redux-saga/effects';
import { authInfo } from '../../../api/sdk/auth/auth.info';
import { authRefreshAccessToken } from '../../../api/sdk/auth/auth.refresh.access.token';
import { authorizationResult, logoutRequest, logoutResult } from './auth.action';
import { authLogout } from '../../../api/sdk/auth/auth.logout';

export function* authorizeUser() {
	let authResponse = yield call(authInfo);

	if (!authResponse.user) {
		const refreshTokenResponse = yield call(authRefreshAccessToken);

		if (!!refreshTokenResponse.success) {
			authResponse = yield call(authInfo);
		}
	}

	yield put(authorizationResult(authResponse.user));
}

export function* logout() {
	yield call(authLogout);
	yield put(logoutResult());
}

export function* authSaga() {
	yield takeEvery(logoutRequest.type, logout);
}
