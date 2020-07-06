import { createStyles, Theme } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '../../../../api/model/user';
import { createSocket, Ws } from '../../../../api/sdk-ws/sdk.ws';
import { CreateMessageResponse } from '../../../../api/sdk/message/create.message';
import { createMessageResult } from '../../../module/message/message.action';
import { updateUserStatus } from '../../../module/user/user.action';
import { CallList } from '../../component/call-list/call.list';
import { Call } from '../../component/call/call';
import { ContactList } from '../../component/contact-list/contact.list';
import { MessageList } from '../../component/message-list/message.list';
import { ThreadList } from '../../component/thread-list/thread.list';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import { NavBar } from '../../component/nav-bar/nav.bar';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const TabBadge = withStyles(() =>
	createStyles({
		badge: {
			right: -15,
			top: 13,
		},
	}),
)(Badge);

const StyledTabs = withStyles((theme: Theme) => createStyles({
	root: {
		borderTop: '1px solid #E5EAF2',
	},
	indicator: {
		backgroundColor: '#A5C0F2',
		bottom: 'auto',
		top: '0',
		right: 'auto',
		left: '0',
		height: 4,
		minHeight: '95px',
	},
	vertical: {
		'& .MuiTabs-indicator': {
			width: 4,
		},
		'& .MuiTab-wrapper': {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignContent: 'center',
			paddingLeft: 30,
			fontSize: '21px',

			'& .MuiSvgIcon-root': {
				marginRight: 20,
			},
		},
		'& .MuiTab-labelIcon': {
			'& :first-child': {
				marginBottom: 0,
			},
		},
	},
	[theme.breakpoints.down('md')]: {
		indicator: {
			backgroundColor: '#A5C0F2',
			bottom: 'auto',
			top: '0',
			right: 'auto',
			left: '0',
			height: 4,
			minHeight: '3px',
		},
	},
}))(Tabs);

const StyledTab = withStyles((theme: Theme) => createStyles({
	root: {
		textTransform: 'none',
		fontWeight: 'lighter',
		minHeight: '69px',
		paddingTop: '11px',
		paddingBottom: '5px',
	},
	textColorPrimary: {
		color: theme.palette.primary.main,
	},
	selected: {
		fontWeight: 'bold',
	},
}))(Tab);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		titleSky: {
			color: theme.palette.primary.main,
			fontWeight: 'lighter',
			marginLeft: 10,
			justifyContent: 'flex-end',
		},
		toolbarDiv: {
			display: 'flex', flexDirection: 'row-reverse',
		},
		mobileMenu: {
			position: 'fixed',
			bottom: '0',
			right: '0',
			left: '0',
			background: '#fff',
			zIndex: 10000,
		},

	}),
);

export const MainScreen: FunctionComponent = () => {
	const [ws, setWs] = useState<Ws | undefined>(undefined);
	const [userToCall, setUserToCall] = useState<User | undefined>(undefined);
	const [userToMessage, setUserToMessage] = useState<User | undefined>(undefined);
	const [isCallActive, setIsCallActive] = useState(false);
	const [isCallStarted, setIsCallStarted] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const dispatch = useDispatch();
	const classes = useStyles();

	const onUserCallClick = useCallback((user) => {
		if (isCallStarted) {
			return;
		}

		setUserToCall(user);
		setUserToMessage(undefined);
	}, [setUserToCall, setUserToMessage]);

	const onCallStart = useCallback(() => {
		setIsCallActive(true);
		setIsCallStarted(true);
		setUserToMessage(undefined);
	}, [setIsCallActive, setUserToCall]);

	const onCallBackClick = useCallback(() => {
		setIsCallActive(false);
	}, [setIsCallActive]);

	const onGoBackToCallClick = useCallback(() => {
		setIsCallActive(true);
	}, [setIsCallActive]);

	const onCallEnd = useCallback(() => {
		setUserToCall(undefined);
		setIsCallActive(false);
		setIsCallStarted(false);
	}, [setUserToCall, setIsCallActive]);

	// setup WS connection
	useEffect(() => {
		(async function initWs() {
			const socket = await createSocket();
			setWs(socket);
		})();

		return () => {
			setWs(undefined);
		};
	}, [setWs]);

	// setup WS event handlers
	useEffect(() => {
		if (!ws) {
			return;
		}

		ws.on('user/status', (data: any) => {
			dispatch(updateUserStatus(data));
		});

		ws.on('message/create', (data: CreateMessageResponse) => {
			dispatch(createMessageResult(data));
		});

		return () => {
			ws.close();
		};
	}, [ws, dispatch]);

	return (
		<>
			<Call
				ws={ws}
				userToCall={userToCall}
				onCallStart={onCallStart}
				onCallEnd={onCallEnd}
				onBackClick={onCallBackClick}
				onBackToCallClick={onGoBackToCallClick}
				hidden={!isCallActive}
			/>

			{!isCallActive && !userToMessage && (
				<HiddenJs lgUp={true}>
					<Grid item style={{flex: 'none'}}>
						<NavBar showAddContact={activeTab === 2}/>
					</Grid>

					<Grid
						container
						item
						style={{
							flexGrow: 1, height: 0, overflow: 'auto',
						}}
						direction="column"
						justify="flex-start"
						alignItems="stretch"
						spacing={0}
					>
						<Typography
							component="div"
							role="tabpanel"
							hidden={activeTab !== 0}
							style={{width: 'inherit'}}
						>
							<ThreadList
								onUserCallClick={setUserToCall}
								onUserMessageClick={setUserToMessage}
							/>
						</Typography>
						<Typography
							component="div"
							role="tabpanel"
							hidden={activeTab !== 2}
							style={{width: 'inherit'}}
						>
							<ContactList
								onUserCallClick={setUserToCall}
								onUserMessageClick={setUserToMessage}
							/>
						</Typography>
						<Typography
							component="div"
							role="tabpanel"
							hidden={activeTab !== 1}
							style={{width: 'inherit'}}
						>
							<CallList
								onUserCallClick={setUserToCall}
								onUserMessageClick={setUserToMessage}
							/>
						</Typography>
					</Grid>

					<Grid item>

						<StyledTabs
							value={activeTab}
							onChange={(e, value) => setActiveTab(value)}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							className={classes.mobileMenu}
						>
							<StyledTab
								icon={<ForumOutlinedIcon/>}
								label="Chats"
							/>
							<StyledTab icon={<PhoneInTalkOutlinedIcon/>} label="Calls"/>
							<StyledTab icon={<PermContactCalendarOutlinedIcon/>} label="Contacts"/>
						</StyledTabs>
					</Grid>
				</HiddenJs>
			)}

			{!isCallActive && (
				<HiddenJs mdDown={true}>
					<Grid
						item container spacing={0}
						style={{flexGrow: 1, height: 0, overflow: 'auto'}}
					>
						<Grid
							item md={5}
							style={{
								height: '100%',
							}}
							container
							direction="column"
							alignItems="stretch"
						>
							<NavBar showAddContact={activeTab === 2}/>

							<Grid
								container
								spacing={0}
								style={{flexGrow: 1, height: 0, overflow: 'auto'}}
							>
								<Grid
									item md={5}
									style={{borderRight: '1px solid #E5EAF2'}}
								>

									<StyledTabs
										value={activeTab}
										onChange={(e, value) => setActiveTab(value)}
										indicatorColor="primary"
										textColor="primary"
										variant="fullWidth"
										orientation="vertical"

									>
										<StyledTab icon={<ForumOutlinedIcon fontSize="large"/>} label="Chats"/>
										<StyledTab icon={<PhoneInTalkOutlinedIcon fontSize="large"/>} label="Calls"/>
										<StyledTab icon={<PermContactCalendarOutlinedIcon fontSize="large"/>} label="Contacts"/>
									</StyledTabs>
								</Grid>
								<Grid
									item md={7}
									container
									style={{borderRight: '1px solid #E5EAF2', height: '100%', overflow: 'auto'}}
								>
									<Typography
										component="div"
										role="tabpanel"
										hidden={activeTab !== 0}
										style={{width: 'inherit'}}
									>
										<ThreadList
											onUserCallClick={setUserToCall}
											onUserMessageClick={setUserToMessage}
										/>
									</Typography>
									<Typography
										component="div"
										role="tabpanel"
										hidden={activeTab !== 2}
										style={{width: 'inherit'}}
									>
										<ContactList
											onUserCallClick={setUserToCall}
											onUserMessageClick={setUserToMessage}
										/>
									</Typography>
									<Typography
										component="div"
										role="tabpanel"
										hidden={activeTab !== 1}
										style={{width: 'inherit'}}
									>
										<CallList
											onUserCallClick={setUserToCall}
											onUserMessageClick={setUserToMessage}
										/>
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item md={7}
							style={{height: '100%'}}
							container
							direction="column"
							alignItems="stretch"
						>
							{!userToMessage && (
								<AppBar
									position="static"
									color="default"
									elevation={0}
								>
									<Toolbar className={classes.toolbarDiv}>

									</Toolbar>
								</AppBar>
							)}
							<MessageList
								onUserCallClick={onUserCallClick}
								userToMessage={userToMessage}
							/>
						</Grid>
					</Grid>
				</HiddenJs>
			)}

			{!isCallActive && (
				<HiddenJs lgUp={true}>
					<MessageList
						onUserCallClick={onUserCallClick}
						userToMessage={userToMessage}
						onBackClick={() => setUserToMessage(undefined)}
					/>
				</HiddenJs>
			)}
		</>
	);
};
