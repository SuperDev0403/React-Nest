import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { UnprocessableEntityException } from '../../../lib/http/exception/http.exception';
import { ValidationResult } from '../../../lib/validator/validation.result';

export const AUTH_LOGIN = url('/auth/password');

export interface AuthUpdatePasswordRequest {
	confirmationToken: string;
	plainPassword: string;
}

export async function authUpdatePassword(data: AuthUpdatePasswordRequest): Promise<undefined | ValidationResult> {
	try {
		await jsonRequest(AUTH_LOGIN, {
			method: 'post',
			body: JSON.stringify(data),
		});
	} catch (e) {
		if (!(e instanceof UnprocessableEntityException)) {
			throw e;
		}

		return e.response.json();
	}

	return undefined;
}
