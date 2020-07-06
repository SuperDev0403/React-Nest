import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { clearAllTokens } from '../../auth/token';

export const AUTH_LOGOUT = url('/auth/logout');

export async function authLogout(): Promise<void> {
	clearAllTokens();

	await jsonRequest(AUTH_LOGOUT, {
		method: 'post',
	});
}
