import { createAction } from '@reduxjs/toolkit';
import { Thread } from '../../../api/model/message';
import { normalize } from 'normalizr';
import { ThreadSchema } from './thread.schema';
import { UpdateLastMessageSeenAtResponse } from '../../../api/sdk/message/update.last.message.seen.at';

export const updateLastMessageSeenAtRequest = createAction(
	'thread/update-last-message-seen-at_request',
	(thread: Thread) => {
		return {payload: thread};
	},
);

export const updateLastMessageSeenAtResult = createAction(
	'thread/update-last-message-seen-at_result',
	(data: UpdateLastMessageSeenAtResponse) => {
		const payload = normalize(data.thread, ThreadSchema);
		return {payload};
	},
);
