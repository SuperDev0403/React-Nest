import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { UnprocessableEntityException } from '../../../lib/http/exception/http.exception';
import { setAccessToken, setRefreshToken } from '../../auth/token';
import { AuthLoginResponse } from './auth.login';
import { ValidationResult } from '../../../lib/validator/validation.result';

export const AUTH_REGISTER = url('/auth/register');

export interface AuthRegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	plainPassword: string;
	phoneNumber: string;
	imageUrl?: string | File;
}

export interface AuthRegisterResponse extends AuthLoginResponse {

}

export async function authRegister(data: AuthRegisterRequest): Promise<AuthRegisterResponse | ValidationResult> {
	let response;

	try {
		response = await jsonRequest(AUTH_REGISTER + '?authenticate=1', {
			method: 'post',
			body: JSON.stringify(data),
		});
	} catch (e) {
		if (!(e instanceof UnprocessableEntityException)) {
			throw e;
		}

		return await e.response.json() as ValidationResult;
	}

	const registerResponse = await response.json() as AuthRegisterResponse;

	setAccessToken(registerResponse.accessToken);
	delete registerResponse.accessToken;

	setRefreshToken(registerResponse.refreshToken);
	delete registerResponse.refreshToken;

	return registerResponse;
}
