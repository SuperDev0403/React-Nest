import { url } from '../../routing/url';
import { User } from '../../model/user';
import { jsonRequest } from '../../request/request';

const GET_CONTACT_LIST = url('/user/me/contact');

export interface GetContactListResponse {
	contactList: User[];
}

export async function getContactList(): Promise<GetContactListResponse> {
	const response = await jsonRequest(GET_CONTACT_LIST);
	return response.json();
}
