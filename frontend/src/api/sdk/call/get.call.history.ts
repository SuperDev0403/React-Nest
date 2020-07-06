import { Pagination } from '../../../lib/pagination/pagination';
import { Message } from '../../model/message';
import { jsonRequest } from '../../request/request';
import { url } from '../../routing/url';

const GET_CALL_HISTORY = url('/call/history');

export interface GetCallHistoryRequest extends Pagination {
}

export interface GetCallHistoryResponse {
	messageList: Message[];
	totalItemCount: number;
}

export async function getCallHistory(data: GetCallHistoryRequest): Promise<GetCallHistoryResponse> {
	const response = await jsonRequest(GET_CALL_HISTORY);
	return response.json();
}
