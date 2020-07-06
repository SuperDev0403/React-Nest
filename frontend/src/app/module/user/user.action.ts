import { createAction } from '@reduxjs/toolkit';
import { User } from '../../../api/model/user';
import { UserStatus } from './user.model';

export const updateUserStatus = createAction('contact-list/update_status_result', (user: { id: User['id'] } & UserStatus) => {
	return {payload: user};
});
