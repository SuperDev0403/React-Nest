import { createAction } from '@reduxjs/toolkit';
import { CreateMessageRequest, CreateMessageResponse } from '../../../api/sdk/message/create.message';
import { normalize } from 'normalizr';
import { MessageSchema } from './message.schema';
import { ThreadSchema } from '../thread/thread.schema';
import { EntityData } from '../entity/entity.model';

export const createMessageRequest = createAction('message/create_request', (data: CreateMessageRequest) => {
	return {payload: data};
});

export const createMessageResult = createAction('message/create_result', (data: CreateMessageResponse) => {
	const {message, thread, errorList, errorMessage} = data;

	if (!message) {
		return {payload: {errorList, errorMessage}, error: true};
	}

	const payload = normalize<any, EntityData, {
		message: string,
		thread: string,
	}>(
		{message, thread},
		{message: MessageSchema, thread: ThreadSchema},
	);

	const meta = {thread, message};

	return {payload, meta};
});
