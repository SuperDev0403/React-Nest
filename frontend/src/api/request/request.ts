import { request as httpRequest } from '../../lib/http/request';
import { fetchConfig } from '../config/fetch.config';
import { composeHeaders } from '../../lib/http/header/compose';
import { authorizationHeader, jsonAcceptHeader, jsonContentTypeHeader } from './header';

/**
 * @see httpRequest
 */
export const request = async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
	const defaultHeaders = fetchConfig.headers || {};
	const initHeaders = init.headers || {};
	const authHeaders = authorizationHeader();

	init = {
		...fetchConfig,
		...init,
		headers: composeHeaders(defaultHeaders, authHeaders, initHeaders),
	};

	return httpRequest(input, init);
};

/**
 * @see httpRequest
 */
export const jsonRequest = async (input: RequestInfo, init: RequestInit = {}) => {
	const initHeaders = init.headers || {};

	const headers = composeHeaders(
		initHeaders, jsonContentTypeHeader(), jsonAcceptHeader(),
	);

	init = {
		...init,
		headers,
	};

	return request(input, init);
};
