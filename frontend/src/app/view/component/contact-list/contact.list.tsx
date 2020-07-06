import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIsLoadingSelector } from '../../../module/loader/loader.selector';
import { fetchContactListRequest } from '../../../module/contact-list/contact.list.action';
import { RootState } from '../../../module/_root/root.state';
import {
	createGetContactByUserIdSelector,
	getContactListSelector,
} from '../../../module/contact-list/contact.list.selector';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { getFullName } from '../../../module/user/user.model';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/PhoneInTalkOutlined';
import { User } from '../../../../api/model/user';
import Typography from '@material-ui/core/Typography';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserStatusBadge } from '../user/user.status.badge';
import { UserAvatar } from '../user/user.avatar';

export const ContactList: FunctionComponent<{
	onUserCallClick?: (user: User) => void,
	onUserMessageClick?: (user: User) => void,
}> = React.memo((props) => {
	const isLoadingSelector = useMemo(createIsLoadingSelector, []);
	const isLoading = useSelector((state: RootState) => isLoadingSelector(state, fetchContactListRequest.type));

	const contactList = useSelector(getContactListSelector);
	const dispatch = useDispatch();

	// fetch list and setup repeated list fetching
	useEffect(() => {
		dispatch(fetchContactListRequest());

		const handle = setInterval(() => {
			dispatch(fetchContactListRequest());
		}, 30000);

		return () => {
			clearInterval(handle);
		};
	}, [dispatch]);

	return (
		<>
			{isLoading && !contactList && (
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

			{contactList && contactList.length <= 0 && (
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
						<ContactPhoneIcon style={{fontSize: 80}} color="primary"/>
					</Typography>
					<Typography variant="h5" gutterBottom={true} align={'center'}>
						You have not added any contacts yet.
					</Typography>
				</Grid>
			)}

			{contactList && contactList.length > 0 && (
				<List style={{paddingTop: '0px'}}>
					{contactList!.map(userId => (
						<ContactListItem
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

export const ContactListItem: FunctionComponent<{
	userId: string,
	onCallClick?: (user: User) => void,
	onMessageClick?: (user: User) => void,
}> = React.memo((props) => {

	const contactSelector = useMemo(createGetContactByUserIdSelector, []);
	const user = useSelector((state: RootState) => contactSelector(state, props.userId));

	if (!user) {
		return null;
	}

	return (
		<ListItem style={{borderBottom: 'solid 1px #f2efef'}} button={true}
							onClick={() => props.onMessageClick && props.onMessageClick(user)}>
			<ListItemAvatar>
				<UserStatusBadge userId={user.id}>
					<UserAvatar user={user}/>
				</UserStatusBadge>
			</ListItemAvatar>
			<ListItemText
				primary={getFullName(user)}
			/>
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="call"
					onClick={() => props.onCallClick && props.onCallClick(user)}
				>
					<PhoneIcon color="primary"/>
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
});
