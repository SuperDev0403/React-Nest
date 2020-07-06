import { createSelector } from 'reselect';
import { WithContactListState } from './contact.list.state';
import { getState as getEntityState } from '../entity/entity.selector';
import { getUserEntityById } from '../user/user.selector';

export const getState = (state: WithContactListState) => state.contactList;

export const getContactListSelector = createSelector(
	[getState],
	(contactListState) => contactListState.itemList,
);

export const createGetContactByUserIdSelector = () => createSelector(
	getEntityState,
	(_: any, id?: string) => id,
	getUserEntityById,
);
