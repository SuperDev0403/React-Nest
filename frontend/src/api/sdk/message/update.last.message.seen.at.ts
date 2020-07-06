import { ValidationResult } from '../../../lib/validator/validation.result';
import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { UnprocessableEntityException } from '../../../lib/http/exception/http.exception';
import { Message, Thread } from '../../model/message';

export const UPDATE_LAST_MESSAGE_SEEN_AT = url('/message/seen');

export interface UpdateLastMessageSeenAtRequest {
	threadId: Message['threadId'];
	seenAt: Date;
}

export interface UpdateLastMessageSeenAtResponse {
	thread: Thread;
}

export async function updateLastMessageSeenAt(data: UpdateLastMessageSeenAtRequest): Promise<UpdateLastMessageSeenAtResponse | ValidationResult> {
	let response;

	try {
		response = await jsonRequest(UPDATE_LAST_MESSAGE_SEEN_AT, {
			method: 'post',
			body: JSON.stringify(data),
		});
	} catch (e) {
		if (!(e instanceof UnprocessableEntityException)) {
			throw e;
		}

		return await e.response.json() as ValidationResult;
	}

	return await response.json() as UpdateLastMessageSeenAtResponse;
}
