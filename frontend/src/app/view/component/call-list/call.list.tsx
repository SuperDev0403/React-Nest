import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PermPhoneMsgIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../module/_root/root.state';
import { getAuthorizedUserSelector } from '../../../module/auth/auth.selector';
import { fetchCallListRequest } from '../../../module/call-list/call.list.action';
import { createGetCallByMessageIdSelector, getCallListSelector } from '../../../module/call-list/call.list.selector';
import { createIsLoadingSelector } from '../../../module/loader/loader.selector';
import { getFullName } from '../../../module/user/user.model';
import { UserStatusBadge } from '../user/user.status.badge';
import { User } from '../../../../api/model/user';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/PhoneInTalkOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import PhoneCallbackOutlinedIcon from '@material-ui/icons/PhoneCallbackOutlined';
import PhoneMissedOutlinedIcon from '@material-ui/icons/PhoneMissedOutlined';
import { UserAvatar } from '../user/user.avatar';

export const CallList: FunctionComponent<{
	onUserCallClick?: (user: User) => void,
	onUserMessageClick?: (user: User) => void,
}> = React.memo((props) => {
	const {onUserCallClick, onUserMessageClick} = props;

	const isLoadingSelector = useMemo(createIsLoadingSelector, []);
	const isLoading = useSelector((state: RootState) => isLoadingSelector(state, fetchCallListRequest.type));

	const callList = useSelector(getCallListSelector);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCallListRequest());
	}, [dispatch]);

	return (
		<>
			{isLoading && !callList && (
				<div style={{
					margin: '0 auto',
					width: '150px',
					padding: '50px',
					textAlign: 'center',
					minHeight: '300px',
				}}>
					<CircularProgress/>
				</div>
			)}

			{callList && callList.length <= 0 && (
				<Grid
					style={{
						margin: '0 auto',
						minWidth: '150px',
						height: '300px',
					}}
					container
					justify="center"
					alignContent="center"
					alignItems="center"
					direction="column"
				>
					<Typography variant="body1">
						<PermPhoneMsgIcon style={{fontSize: 80}} color="primary"/>
					</Typography>
					<Typography variant="h5" gutterBottom={true} align={'center'}>
						You have not conversed with anyone yet.
					</Typography>
				</Grid>
			)}

			{callList && callList.length > 0 && (
				<List style={{paddingTop: '0px'}}>
					{callList?.map((messageId) => (
						<CallListItem
							key={messageId}
							messageId={messageId}
							onCallClick={onUserCallClick}
							onMessageClick={onUserMessageClick}
						/>
					))}
				</List>
			)}
		</>
	);
});

export const CallListItem: FunctionComponent<{
	messageId: string,
	onCallClick?: (user: User) => void,
	onMessageClick?: (user: User) => void,
}> = React.memo((props) => {
	const {messageId, onCallClick, onMessageClick} = props;

	const authorizedUser = useSelector(getAuthorizedUserSelector);

	const callSelector = useMemo(createGetCallByMessageIdSelector, []);
	const call = useSelector((state: RootState) => callSelector(state, messageId));

	if (!call) {
		return null;
	}

	const callUser = authorizedUser?.id !== call.from.id ? call.from : call.to;
	const isIncomingCall = authorizedUser?.id !== call.from.id;
	const isMissedCall = !call?.payload?.endAt;

	const isToday = moment().format('LL') === moment(call?.payload?.startAt).format('LL');
	const isYesterday = moment().subtract(1, 'day').format('LL') === moment(call?.payload?.startAt).format('LL');

	return (
		<ListItem style={{borderBottom: 'solid 1px #f2efef'}} button={true}
							onClick={() => onMessageClick && onMessageClick(callUser)}>
			<ListItemAvatar>
				<UserStatusBadge userId={callUser.id}>
					<UserAvatar user={callUser}/>
				</UserStatusBadge>
			</ListItemAvatar>
			<ListItemText
				primary={getFullName(callUser)}
				secondary={(
					<>
						{isIncomingCall ? (
							isMissedCall ? (
								<PhoneMissedOutlinedIcon style={{position: 'relative', top: '4px'}} fontSize="small"/>
							) : (
								<PhoneCallbackOutlinedIcon style={{position: 'relative', top: '4px'}} fontSize="small"/>
							)
						) : (
							isMissedCall ? (
								<PhoneMissedOutlinedIcon style={{position: 'relative', top: '4px'}} fontSize="small"/>
							) : (
								<PhoneInTalkOutlinedIcon style={{position: 'relative', top: '4px'}} fontSize="small"/>
							)
						)}
						&nbsp;&nbsp;
						{isToday && (moment(call?.payload?.startAt).format('LT'))}
						{isYesterday && (
							'Yesterday, ' + moment(call?.payload?.startAt).format('LT')
						)}
						{!isToday && !isYesterday && (
							moment(call?.payload?.startAt).format('ll')
							+ ', ' +
							moment(call?.payload?.startAt).format('LT')
						)}
					</>
				)}
				secondaryTypographyProps={{
					noWrap: true,
					style: {
						color: '#063B9E',
					},
				}}
			/>
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="call"
					onClick={() => onCallClick && onCallClick(callUser)}
				>
					<PhoneIcon color="primary"/>
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
});
