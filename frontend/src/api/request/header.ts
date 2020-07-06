import { acceptHeader, contentTypeHeader } from '../../lib/http/header/header';
import { APPLICATION_JSON } from '../../lib/http/mime/mime';
import { getAccessToken } from '../auth/token';

export const jsonContentTypeHeader = () => contentTypeHeader(APPLICATION_JSON);

export const jsonAcceptHeader = () => acceptHeader(APPLICATION_JSON);

export const authorizationHeader = (token?: string): HeadersInit => {
	const accessToken = token || getAccessToken();

	if (!accessToken) {
		return {};
	}

	return {
		'Authorization': 'Bearer ' + accessToken,
	};
};
