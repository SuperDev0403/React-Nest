import React, { FunctionComponent } from 'react';
import { User } from '../../../../api/model/user';
import { getUserImageUrl } from '../../../../api/sdk/user/get.user.image';
import Avatar, { AvatarProps } from '@material-ui/core/Avatar';
import { getFullName, getInitials } from '../../../module/user/user.model';

export interface UserAvatarProps extends AvatarProps {
	user?: User
}

export const UserAvatar: FunctionComponent<UserAvatarProps> = React.memo(
	({user, children, ...props}) => {
		const src = getUserImageUrl(user);
		const alt = !!user ? getFullName(user) : undefined;
		const initials = !!user ? getInitials(user) : undefined;

		return (
			<Avatar
				style={{fontSize: '1rem'}}
				alt={alt}
				src={src}
				{...props}
			>
				{children || initials}
			</Avatar>
		);
	},
);
