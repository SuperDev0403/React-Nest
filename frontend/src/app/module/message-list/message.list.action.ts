import { createAction } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { MessageListSchema } from '../message/message.schema';
import { Thread } from '../../../api/model/message';
import { GetMessageListResponse } from '../../../api/sdk/message/get.message.list';

export const fetchMessageListRequest = createAction('message-list/fetch_request', (thread: Thread) => {
	return {payload: thread};
});

export const fetchMessageListResult = createAction('message-list/fetch_result', (data: GetMessageListResponse, thread: Thread) => {
	const {messageList, totalItemCount} = data;

	const payload = {
		...normalize(messageList, MessageListSchema),
		totalItemCount,
	};

	const meta = {thread};

	return {payload, meta};
});

