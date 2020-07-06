import { ValidationResult } from '../../../lib/validator/validation.result';
import { User } from '../../model/user';
import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { UnprocessableEntityException } from '../../../lib/http/exception/http.exception';

export const ADD_CONTACT = url('/user/me/contact');

export interface AddContactRequest {
	emailOrPhone: string;
}

export interface AddContactResponse {
	user: User;
	contact: User;
}

export async function addContact(data: AddContactRequest): Promise<AddContactResponse | ValidationResult> {
	let response;

	try {
		response = await jsonRequest(ADD_CONTACT, {
			method: 'post',
			body: JSON.stringify(data),
		});
	} catch (e) {
		if (!(e instanceof UnprocessableEntityException)) {
			throw e;
		}

		return await e.response.json() as ValidationResult;
	}

	return await response.json() as AddContactResponse;
}
