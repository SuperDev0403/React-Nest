import { ValidationResult } from '../../../lib/validator/validation.result';
import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { UnprocessableEntityException } from '../../../lib/http/exception/http.exception';
import { Message, MessageType, Thread } from '../../model/message';

export const CREATE_MESSAGE = url('/message');

export interface CreateMessageRequest {
	type: MessageType;
	fromId: string;
	toId: string;
	text?: string;
	startAt?: Date;
	endAt?: Date;
	imageUrl?: string | File;
}

export interface CreateMessageResponse extends Partial<ValidationResult> {
	message: Message;
	thread: Thread,
}

export async function createMessage(data: CreateMessageRequest): Promise<CreateMessageResponse | ValidationResult> {
	let response;

	try {
		response = await jsonRequest(CREATE_MESSAGE, {
			method: 'post',
			body: JSON.stringify(data),
		});
	} catch (e) {
		if (!(e instanceof UnprocessableEntityException)) {
			throw e;
		}

		return await e.response.json() as ValidationResult;
	}

	return await response.json() as CreateMessageResponse;
}
