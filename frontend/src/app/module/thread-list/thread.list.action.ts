import { createAction } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { ThreadListSchema } from '../thread/thread.schema';
import { Thread } from '../../../api/model/message';

export const fetchThreadListRequest = createAction('thread-list/fetch_request');

export const fetchThreadListResult = createAction('thread-list/fetch_result', (itemList: Thread[]) => {
	const payload = normalize(itemList, ThreadListSchema);
	return {payload};
});
