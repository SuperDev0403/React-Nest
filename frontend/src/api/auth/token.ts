import Cookies from 'universal-cookie';
import { cookieConfig } from '../config/cookie.config';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

const cookies = new Cookies();

let accessToken: string | undefined = undefined;
let refreshToken: string | undefined = undefined;

(window as any).cookies = cookies;


export function getAccessToken() {
	if (!accessToken) {
		accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || undefined;
	}

	return accessToken;
}

export function setAccessToken(value: string | undefined) {
	accessToken = value;

	if (!accessToken) {
		cookies.remove(ACCESS_TOKEN_COOKIE);
	} else {
		cookies.set(ACCESS_TOKEN_COOKIE, value, cookieConfig.accessToken);
	}
}

export function getRefreshToken() {
	if (!refreshToken) {
		refreshToken = cookies.get(REFRESH_TOKEN_COOKIE) || undefined;
	}

	return refreshToken;
}

export function setRefreshToken(value: string | undefined) {
	refreshToken = value;

	if (!refreshToken) {
		cookies.remove(REFRESH_TOKEN_COOKIE);
	} else {
		cookies.set(REFRESH_TOKEN_COOKIE, value, cookieConfig.refreshToken);
	}
}

export function clearAllTokens() {
	setRefreshToken(undefined);
	setAccessToken(undefined);
}
