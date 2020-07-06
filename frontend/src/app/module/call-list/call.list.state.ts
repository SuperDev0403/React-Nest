import { Message } from '../../../api/model/message';

export interface WithCallListState {
	callList: CallListState;
}

export interface CallListState {
	itemList?: Message['id'][];
}

export const INITIAL_STATE: CallListState = {
	itemList: undefined,
};
