import { Message } from '../../../api/model/message';

export interface WithMessageListState {
	messageList: MessageListState;
}

export interface MessageListState {
	[userId: string]: {
		itemList?: Message['id'][];
		totalItemCount?: number;
	}
}

export const INITIAL_STATE: MessageListState = {};
