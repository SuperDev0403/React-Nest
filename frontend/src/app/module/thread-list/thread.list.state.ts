import { Thread } from '../../../api/model/message';

export interface WithThreadListState {
	threadList: ThreadListState;
}

export interface ThreadListState {
	itemList?: Thread['id'][];
}

export const INITIAL_STATE: ThreadListState = {
	itemList: undefined,
};
