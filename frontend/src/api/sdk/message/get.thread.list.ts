import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { Thread } from '../../model/message';

const GET_THREAD_LIST = url('/message/thread');

export interface GetThreadListResponse {
	threadList: Thread[];
}

export async function getThreadList(): Promise<GetThreadListResponse> {
	const response = await jsonRequest(GET_THREAD_LIST);
	return response.json();
}
