import { User } from '../../model/user';

export const getUserImageUrl = (user: User | undefined) => {
	return user?.imageUrl;
};
