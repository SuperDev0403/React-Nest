import React, { FunctionComponent, useMemo } from 'react';
import { User } from '../../../../api/model/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../module/_root/root.state';
import { createGetUserStatusSelector } from '../../../module/user/user.selector';
import Badge, { BadgeProps } from '@material-ui/core/Badge';
import { createStyles, Theme, withStyles } from '@material-ui/core';

const OnlineBadge = withStyles((theme: Theme) =>
	createStyles({
		badge: {
			backgroundColor: '#44b700',
			color: '#44b700',
			bottom: 7,
			right: 7,
			width: 12,
			height: 12,
			borderRadius: 12,
		},
	}),
)(Badge);

const OfflineBadge = withStyles((theme: Theme) =>
	createStyles({
		badge: {
			backgroundColor: '#E16C6C',
			color: '#E16C6C',
			bottom: 7,
			right: 7,
			width: 12,
			height: 12,
			borderRadius: 12,
		},
	}),
)(Badge);

export const UserStatusBadge: FunctionComponent<{
	userId: User['id'],
	anchorOrigin?: Partial<BadgeProps['anchorOrigin']>,
	style?: BadgeProps['style'],
	classes?: BadgeProps['classes'],
	className?: BadgeProps['className'],
}> = React.memo(({userId, children, anchorOrigin: anchorOriginProps, ...props}) => {

	const userStatusSelector = useMemo(createGetUserStatusSelector, []);
	const userStatus = useSelector((state: RootState) => userStatusSelector(state, userId));

	const anchorOrigin: BadgeProps['anchorOrigin'] = {
		horizontal: 'right',
		vertical: 'bottom',
		...(anchorOriginProps || {}),
	};

	const Badge = userStatus?.isOnline ? OnlineBadge : OfflineBadge;

	return (
		<Badge
			{...props}
			badgeContent={' '}
			variant="dot"
			anchorOrigin={anchorOrigin}
		>
			{children}
		</Badge>
	);
});
