import { User } from '../../../api/model/user';

export interface UserStatus {
	isOnline?: boolean;
	isBusy?: boolean;
}

export function getInitials(user: User) {
	return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
}

export function getFullName(user: User) {
	return user.firstName + ' ' + user.lastName;
}
