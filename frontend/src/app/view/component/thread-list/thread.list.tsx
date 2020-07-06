import React, { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIsLoadingSelector } from '../../../module/loader/loader.selector';
import { fetchThreadListRequest } from '../../../module/thread-list/thread.list.action';
import { RootState } from '../../../module/_root/root.state';
import {
	createGetThreadByUserIdSelector,
	getThreadListSelector,
} from '../../../module/thread-list/thread.list.selector';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { getFullName } from '../../../module/user/user.model';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/PhoneInTalkOutlined';
import { User } from '../../../../api/model/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg';
import { UserStatusBadge } from '../user/user.status.badge';
import { MessageType } from '../../../../api/model/message';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import moment from 'moment';
import { UserAvatar } from '../user/user.avatar';

export const ThreadList: FunctionComponent<{
	onUserCallClick?: (user: User) => void,
	onUserMessageClick?: (user: User) => void,
}> = React.memo((props) => {
	const isLoadingSelector = useMemo(createIsLoadingSelector, []);
	const isLoading = useSelector((state: RootState) => isLoadingSelector(state, fetchThreadListRequest.type));

	const threadList = useSelector(getThreadListSelector);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchThreadListRequest());
	}, [dispatch]);

	return (
		<>
			{isLoading && !threadList && (
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

			{threadList && threadList.length <= 0 && (
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

			{threadList && threadList.length > 0 && (
				<List style={{width: '100%', paddingTop: '0'}}>
					{threadList!.map(userId => (
						<ThreadListItem
							key={userId}
							userId={userId}
							onCallClick={props.onUserCallClick}
							onMessageClick={props.onUserMessageClick}
						/>
					))}
				</List>
			)}
		</>
	);
});

export const ThreadListItem: FunctionComponent<{
	userId: string,
	onCallClick?: (user: User) => void,
	onMessageClick?: (user: User) => void,
}> = React.memo((props) => {
	const {userId, onMessageClick} = props;

	const threadSelector = useMemo(createGetThreadByUserIdSelector, []);
	const thread = useSelector((state: RootState) => threadSelector(state, userId));

	const onItemClick = useCallback(() => {
		onMessageClick && onMessageClick(thread?.user!);
	}, [thread, onMessageClick]);

	if (!thread) {
		return null;
	}

	const message = thread.lastMessage;
	const isToday = moment().format('LL') === moment(message?.createdAt).format('LL');
	const isYesterday = moment().subtract(1, 'day').format('LL') === moment(message?.createdAt).format('LL');

	return (
		<ListItem style={{borderBottom: 'solid 1px #f2efef'}} button={true} onClick={onItemClick}>
			<ListItemAvatar>
				<UserStatusBadge userId={thread?.user.id}>
					{/*<Badge badgeContent={thread?.newMessageCount} color="primary">*/}
					<UserAvatar user={thread?.user}/>
					{/*</Badge>*/}
				</UserStatusBadge>
			</ListItemAvatar>
			<ListItemText
				primaryTypographyProps={{
					noWrap: true,
					style: {
						color: '#A5C0F2',
					},
				}}
				primary={(
					<>
						<span style={{color: '#000'}}>
								{getFullName(thread?.user)}
						</span>
						&nbsp;
						<span
							style={{
								fontWeight: 'normal',
								fontSize: '12px',
							}}
						>
							{/* {isToday && moment(message?.createdAt).format('LT')}
							{isYesterday && 'Yesterday,' + moment(message?.createdAt).format('LT')}
							{!isToday && !isYesterday && (
									moment(message?.createdAt).format('ll')
									+ ', ' +
									moment(message?.createdAt).format('LT')
							)}*/}
						</span>
					</>
				)}
				secondary={
					thread?.lastMessage?.type === MessageType.TEXT ? (
						<>
							{thread?.lastMessage?.payload.text}
						</>
					) : (
						thread?.lastMessage?.type === MessageType.IMAGE ? (
							<>
								<ImageOutlinedIcon fontSize="small" style={{position: 'relative', top: '4px'}}/> Image
							</>
						) : (
							<>
								<CallOutlinedIcon style={{position: 'relative', top: '4px'}} fontSize="small"/>
								{' '}
								{!thread?.lastMessage?.payload?.endAt && 'Missed '}
								Call
							</>
						)
					)
				}
				secondaryTypographyProps={{
					noWrap: true,
					style: {
						fontSize: '15px',
						color: '#000',
						fontWeight: (thread?.newMessageCount || 0) > 0 ? 'bold' : 'lighter',
					},
				}}
			/>
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="call"
					onClick={() => props.onCallClick && props.onCallClick(thread?.user)}
				>
					<PhoneIcon color="primary"/>
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
});
