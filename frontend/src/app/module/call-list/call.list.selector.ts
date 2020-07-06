import { createSelector } from 'reselect';
import { getState as getEntityState } from '../entity/entity.selector';
import { getMessageEntityById } from '../message/message.selector';
import { WithCallListState } from './call.list.state';

export const getState = (state: WithCallListState) => state.callList;

export const getCallListSelector = createSelector(
	[getState],
	(callListState) => callListState.itemList,
);

export const createGetCallByMessageIdSelector = () => createSelector(
	getEntityState,
	(_: any, id?: string) => id,
	getMessageEntityById,
);
