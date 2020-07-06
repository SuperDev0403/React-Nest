import { jsonRequest } from '../../request/request';
import { url } from '../../routing/url';
import { UnauthorizedException } from '../../../lib/http/exception/http.exception';
import { getAccessToken, setAccessToken } from '../../auth/token';
import { User } from '../../model/user';

export const AUTH_INFO = url('/auth/info');

export interface AuthInfoResponse {
	user?: User;
}

export async function authInfo(): Promise<AuthInfoResponse> {
	let response;

	if (!getAccessToken()) {
		return {};
	}

	try {
		response = await jsonRequest(AUTH_INFO);
	} catch (e) {
		if (!(e instanceof UnauthorizedException)) {
			throw e;
		}

		setAccessToken(undefined);
		return {};
	}

	return response.json();
}
