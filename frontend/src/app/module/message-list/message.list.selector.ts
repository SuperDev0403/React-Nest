import { WithMessageListState } from './message.list.state';
import { getState as getEntityState } from '../entity/entity.selector';
import { getMessageEntityById } from '../message/message.selector';
import { createSelector } from 'reselect';

export const getState = (state: WithMessageListState) => state.messageList;

export const createGetMessageListByUserIdSelector = () => createSelector(
	getState,
	(_: any, id?: string) => id,
	(messageListState, id) => {
		return !!id ? messageListState[id]?.itemList : undefined;
	},
);

export const createGetMessageByIdSelector = () => createSelector(
	getEntityState,
	(_: any, id?: string) => id,
	getMessageEntityById,
);
