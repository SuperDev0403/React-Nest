import { createAction } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { Message } from '../../../api/model/message';
import { CallListSchema } from './call.list.schema';

export const fetchCallListRequest = createAction('call-list/fetch_request');

export const fetchCallListResult = createAction('call-list/fetch_result', (itemList: Message[]) => {
	const payload = normalize(itemList, CallListSchema);
	return {payload};
});
