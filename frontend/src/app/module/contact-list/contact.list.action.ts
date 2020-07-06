import { createAction } from '@reduxjs/toolkit';
import { User } from '../../../api/model/user';
import { normalize } from 'normalizr';
import { ContactListSchema } from './contact.list.schema';
import { UserSchema } from '../user/user.schema';

export const fetchContactListRequest = createAction('contact-list/fetch_request');

export const fetchContactListResult = createAction('contact-list/fetch_result', (itemList: User[]) => {
	const payload = normalize(itemList, ContactListSchema);
	return {payload};
});

export const addContactResult = createAction('contact-list/add_result', (user: User) => {
	const payload = normalize(user, UserSchema);
	return {payload};
});
