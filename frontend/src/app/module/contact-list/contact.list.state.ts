import { User } from '../../../api/model/user';

export interface WithContactListState {
	contactList: ContactListState;
}

export interface ContactListState {
	itemList?: User['id'][];
}

export const INITIAL_STATE: ContactListState = {
	itemList: undefined,
};
