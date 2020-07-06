import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';
import { Message } from '../../model/message';
import { Pagination } from '../../../lib/pagination/pagination';

const GET_MESSAGE_LIST = url('/message/thread/:id');

export interface GetMessageListRequest extends Pagination {
	threadId: Message['threadId'];
}

export interface GetMessageListResponse {
	messageList: Message[];
	totalItemCount: number;
}

export async function getMessageList(data: GetMessageListRequest): Promise<GetMessageListResponse> {
	const url = GET_MESSAGE_LIST.replace(':id', data.threadId);
	const response = await jsonRequest(url);
	return response.json();
}
