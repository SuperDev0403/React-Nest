import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/PhoneInTalkOutlined';
import Alert from '@material-ui/lab/Alert';
import { FORM_ERROR } from 'final-form';
import moment from 'moment';
import React, { ChangeEvent, createRef, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { MessageType } from '../../../../api/model/message';
import { User } from '../../../../api/model/user';
import { createMessage, CreateMessageRequest } from '../../../../api/sdk/message/create.message';
import { getMessageImageUrl } from '../../../../api/sdk/message/get.message.image';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import { createFromValidationResult } from '../../../../lib/final-form/submission.error';
import { ValidationResult } from '../../../../lib/validator/validation.result';
import { RootState } from '../../../module/_root/root.state';
import { getAuthorizedUserSelector } from '../../../module/auth/auth.selector';
import { createIsLoadingSelector } from '../../../module/loader/loader.selector';
import { fetchMessageListRequest } from '../../../module/message-list/message.list.action';
import {
	createGetMessageByIdSelector,
	createGetMessageListByUserIdSelector,
} from '../../../module/message-list/message.list.selector';
import { createMessageResult } from '../../../module/message/message.action';
import { createGetThreadByUserIdSelector } from '../../../module/thread-list/thread.list.selector';
import { updateLastMessageSeenAtRequest } from '../../../module/thread/thread.action';
import { getFullName } from '../../../module/user/user.model';
import { UserStatusBadge } from '../user/user.status.badge';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import Button from '@material-ui/core/Button';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import { UserAvatar } from '../user/user.avatar';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { uploadFile } from '../../../../api/sdk/file/upload.file';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backButton: {},
		avatar: {},
		title: {
			flexGrow: 1,
		},
		appBar: {},
		whiteIcon: {},
		inputContainer: {},
		inputTextarea: {
			borderRadius: '50px',
		},
		badge: {
			top: 4,
			right: -15,
		},
		callButton: {
			color: theme.palette.primary.main,
		},
		titleSky: {
			color: theme.palette.primary.main,
			fontWeight: 'lighter',
			marginLeft: 10,
		},

		attachFileIcon: {
			marginTop: '8px',
		},

	}),
);

export const MessageList: FunctionComponent<{
	userToMessage?: User;
	onUserCallClick?: (user: User) => void;
	onBackClick?: () => void;
	hideAppBar?: boolean;
}> = React.memo((props) => {
	const {userToMessage, onBackClick, onUserCallClick, hideAppBar} = props;

	const dispatch = useDispatch();
	const classes = useStyles();
	const listRef = createRef<HTMLDivElement>();

	const threadSelector = useMemo(createGetThreadByUserIdSelector, []);
	const thread = useSelector((state: RootState) => threadSelector(state, userToMessage?.id));

	const messageListSelector = useMemo(createGetMessageListByUserIdSelector, []);
	const messageList = useSelector((state: RootState) => messageListSelector(state, userToMessage?.id));

	const isLoadingSelector = useMemo(createIsLoadingSelector, []);
	const isLoading = useSelector((state: RootState) => isLoadingSelector(state, fetchMessageListRequest.type));

	const scrollToBottom = useCallback(() => {
		if (!listRef.current) {
			return;
		}
		listRef.current.scrollTop = listRef.current.scrollHeight - listRef.current.clientHeight;
	}, [listRef]);

	useEffect(() => {
		if (!thread) {
			return;
		}

		dispatch(fetchMessageListRequest(thread));
	}, [thread?.id, dispatch]); // trigger load only when thread ID changes

	useEffect(function() {
		// TODO: implement smarter scroll handling
		scrollToBottom();
	}, [messageList?.length]);

	useEffect(() => {
		if (!thread) {
			return;
		}
		if (!messageList) {
			return;
		}

		dispatch(updateLastMessageSeenAtRequest(thread!));
	}, [thread?.id, messageList?.length, dispatch]);

	if (!userToMessage) {
		return null;
	}

	return (
		<>
			<Grid item>
				{!hideAppBar && (
					<AppBar
						position="static"
						color="default"
						elevation={0}
						classes={{root: classes.appBar}}
					>
						<Toolbar>
							{onBackClick && (
								<IconButton
									edge="start"
									className={classes.backButton}
									color="inherit"
									aria-label="menu"
									onClick={onBackClick}
								>
									<KeyboardBackspaceOutlinedIcon style={{fill: '#115293'}}/>
								</IconButton>
							)}

							<Typography variant="h6" className={classes.title}>
								<UserStatusBadge
									userId={userToMessage.id}
									classes={{
										badge: classes.badge,
									}}
								>
									{getFullName(userToMessage)}
								</UserStatusBadge>
							</Typography>

							{onUserCallClick && (
								<Button
									aria-label="call"
									onClick={() => onUserCallClick?.(userToMessage)}
								>
									<HiddenJs lgUp={true}>
										<PhoneIcon color="primary" className={classes.whiteIcon}/>
									</HiddenJs>
									<HiddenJs mdDown={true}>
										{/*<Typography variant="h6" className={classes.titleSky}>SkyTECH</Typography>*/}
										<VideocamOutlinedIcon color="primary" className={classes.whiteIcon} style={{marginLeft: '20px'}}/>
										&nbsp;&nbsp;
										<span className={classes.callButton}>Video call</span>
									</HiddenJs>
								</Button>
							)}


						</Toolbar>

					</AppBar>
				)}

			</Grid>

			<Grid
				item
				container
				style={{flexGrow: 1, height: 0, overflow: 'auto', position: 'relative'}}
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={0}
			>
				{!!messageList && messageList.length > 0 && (
					<div ref={listRef} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'scroll'}}>
						<List>
							{messageList?.map((messageId, index) => {
								return (
									<React.Fragment key={messageId}>
										<MessageDateDivider messageId={messageId} prevMessageId={messageList[index - 1]!}/>
										<MessageListItem messageId={messageId}/>
									</React.Fragment>
								);
							})}
						</List>
					</div>
				)}

				{isLoading && !messageList && (
					<div style={{padding: '20px'}}>
						<CircularProgress/>
					</div>
				)}
			</Grid>

			<Grid
				item
				className={classes.inputContainer}
			>
				<MessageInput userToMessage={userToMessage!}/>
			</Grid>
		</>
	);
});

export const MessageDateDivider: FunctionComponent<{
	messageId: string;
	prevMessageId?: string;
}> = React.memo((props) => {
	const {messageId, prevMessageId} = props;

	const messageSelector = useMemo(createGetMessageByIdSelector, []);
	const message = useSelector((state: RootState) => messageSelector(state, messageId));

	const prevMessageSelector = useMemo(createGetMessageByIdSelector, []);
	const prevMessage = useSelector((state: RootState) => prevMessageSelector(state, prevMessageId));

	const isToday = moment().format('LL') === moment(message?.createdAt).format('LL');
	const isYesterday = moment().subtract(1, 'day').format('LL') === moment(message?.createdAt).format('LL');
	const isSameDayAsPrev = prevMessage && moment(message?.createdAt).format('LL') === moment(prevMessage?.createdAt).format('LL');

	if (isSameDayAsPrev) {
		return null;
	}

	return (
		<ListItem
			alignItems="center"
		>
			<Grid
				container
				justify="center"
				alignContent="center"
				alignItems="center"
				style={{margin: '10px 0'}}
			>
				<Grid item style={{flexGrow: 1}}>
					<div style={{height: 1, backgroundColor: '#E5EAF2'}}/>
				</Grid>
				<Grid
					item
					style={{
						padding: '0 15px',
					}}
				>
					<Box
						style={{
							fontSize: '13px',
						}}
						fontWeight="fontWeightLight"
					>
						{isToday && 'Today'}
						{isYesterday && 'Yesterday'}
						{!isToday && !isYesterday && (
							moment(message?.createdAt).format('LL')
						)}
					</Box>
				</Grid>
				<Grid item style={{flexGrow: 1}}>
					<div style={{height: 1, backgroundColor: '#E5EAF2'}}/>
				</Grid>
			</Grid>
		</ListItem>
	);
});

export const MessageListItem: FunctionComponent<{
	messageId: string;
}> = React.memo((props) => {
	const {messageId} = props;

	const authorizedUser = useSelector(getAuthorizedUserSelector);

	const messageSelector = useMemo(createGetMessageByIdSelector, []);
	const message = useSelector((state: RootState) => messageSelector(state, messageId));

	const isOutgoing = useMemo(
		() => message?.from.id === authorizedUser?.id,
		[authorizedUser, message],
	);

	if (message?.type === MessageType.CALL) {
		const isMissedCall = !message?.payload?.endAt;

		return (
			<ListItem
				alignItems="center"
			>
				<ListItemText
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					primary={
						<Typography
							component="div"
							variant="body2"
							style={{
								fontSize: '12px',
								textAlign: 'center',
								display: 'flex',
								padding: '10px',
							}}
						>
							{isMissedCall ? (
								isOutgoing ? 'Call Not Answered' : 'Missed Call'
							) : (
								'Call'
							)}
							&nbsp;&nbsp;
							<span style={{color: '#A5C0F2'}}>
                                {moment(message?.payload?.startAt).format('LT')}
                            </span>
						</Typography>
					}
				/>
			</ListItem>
		);
	}

	return (
		<ListItem
			alignItems="flex-start"
			style={{
				display: 'flex',
				flexDirection: isOutgoing ? 'row-reverse' : 'row',
				justifyContent: 'flex-start',
			}}
		>
			{!isOutgoing && (
				<ListItemAvatar
					style={{
						display: 'flex',
						flexDirection: 'row',
						minWidth: '63px',
					}}
				>
					<UserAvatar user={message?.from!}/>
				</ListItemAvatar>
			)}

			<ListItemText
				style={{
					display: 'flex',
					flexDirection: 'column-reverse',
					maxWidth: '65%',
					alignItems: isOutgoing ? 'flex-end' : 'flex-start',
				}}
				primary={
					<>
						{message?.type === MessageType.IMAGE && (
							<Box style={{paddingTop: '10px'}}>
								<a href={getMessageImageUrl(message)} target="_blank" rel="noopener noreferrer">
									<img
										style={{height: '150px', maxWidth: '100%', borderRadius: '13px'}}
										src={getMessageImageUrl(message)}
										alt="Image"
									/>
								</a>
							</Box>
						)}
						{!!message?.payload?.text && (
							<Typography
								component="span"
								gutterBottom={true}
								variant="body2"
								style={{
									fontSize: '16px',
									fontWeight: 'lighter',
									lineHeight: '20px',
								}}
							>
								{message?.payload?.text}
							</Typography>
						)}
					</>
				}
				secondary={
					<>
						{!isOutgoing && (
							<Typography
								component="span"
								style={{
									display: 'inline-block',
									fontSize: '15px',
									fontWeight: 500,
									color: '#000',
									marginRight: '5px',
								}}
								color="textPrimary"
							>
								{getFullName(message?.from!)}
							</Typography>
						)}

						<Typography
							component="span"
							variant="caption"
							style={{
								display: 'inline-block',
								color: '#A5C0F2',
								fontSize: '12px',
								fontWeight: 'lighter',
							}}
						>
							{moment(message?.createdAt).format('LT')}
						</Typography>
					</>
				}
			/>
		</ListItem>
	);
});

export const MessageInput: FunctionComponent<{
	userToMessage: User,
}> = React.memo((props) => {
	const {userToMessage} = props;

	const dispatch = useDispatch();
	const authorizedUser = useSelector(getAuthorizedUserSelector);

	const [initialValues, setInitialValues] = useState<CreateMessageRequest | undefined>(undefined);

	const resetInitialValues = useCallback(() => {
		setInitialValues({
			type: MessageType.TEXT,
			fromId: authorizedUser?.id!,
			toId: userToMessage?.id!,
		});
	}, [authorizedUser, userToMessage]);

	const onMessageSubmit = useCallback(async (data: CreateMessageRequest) => {
		let response;

		// if image is submitted
		// upload the image first and then use it's URL
		if (!!data.imageUrl) {
			const uploadResponse = await uploadFile({file: (data.imageUrl as File)});
			data.imageUrl = uploadResponse.fileUrl;
			data.type = MessageType.IMAGE;
		}

		try {
			response = await createMessage(data);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if ('message' in response && !!response.message) {
			resetInitialValues();
			dispatch(createMessageResult(response));
			return;
		}

		return createFromValidationResult(response as ValidationResult);
	}, [resetInitialValues, dispatch]);

	// reset input field after submit
	useEffect(() => {
		if (!userToMessage) {
			return;
		}
		resetInitialValues();
	}, [authorizedUser, userToMessage, resetInitialValues]);

	const classes = useStyles();

	return (
		<Form
			onSubmit={onMessageSubmit}
			initialValues={initialValues}
			keepDirtyOnReinitialize={false}
			initialValuesEqual={(a, b) => a === b}
		>
			{({handleSubmit, submitting, form, ...props}) => (
				<form onSubmit={handleSubmit}>
					{!!props.error && (
						<Alert severity="warning">{props.error}</Alert>
					)}
					{!!props.submitError && (
						<Alert severity="error">{props.submitError}</Alert>
					)}

					<Grid
						container
						direction="row"
						style={{padding: 8}}
					>
						<Grid item>
							<Field name="imageUrl">
								{(props) => {
									const {value, ...inputProps} = props.input;

									return (
										<FormControl margin="none">
											<input
												{...inputProps}
												onChange={(event: ChangeEvent<HTMLInputElement>) => inputProps.onChange(event.target.files?.[0])}
												color="primary"
												accept="image/*"
												type="file"
												id="icon-button-file"
												style={{display: 'none'}}
											/>
											<label htmlFor="icon-button-file" className={classes.attachFileIcon}>
												<Button
													variant="contained"
													component="span"
													color="primary"
												>
													<AttachFileOutlinedIcon/>
												</Button>
												&nbsp;&nbsp;
												{!!props.input.value && (
													<Typography component="span">
														{(props.input.value as File).name}
													</Typography>
												)}
											</label>
											{hasError(props.meta) && (
												<FormHelperText error={true}>
													{getError(props.meta)}
												</FormHelperText>
											)}
										</FormControl>
									);
								}}
							</Field>
						</Grid>
						<Grid item style={{flexGrow: 1}}>
							<Field name="text">
								{(props) => (
									<TextField
										{...props.input}
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										placeholder="Write your message here"
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
										InputProps={{
											style: {
												backgroundColor: '#fff',
											},
											classes: {
												notchedOutline: classes.inputTextarea,
											},
											onKeyPress: (event) => {
												if (event.which == 13 && !event.shiftKey) {
													event.preventDefault();
													form.submit();
												}
											},
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														type="submit"
														disabled={submitting}
														style={{backgroundColor: '#063B9E', marginRight: -5}}
													>
														{submitting ? (
															<CircularProgress size={20}/>
														) : (
															<SendOutlinedIcon fontSize="small" style={{
																color: '#fff',
																transform: 'rotate(315deg) translate(2px, -1px)',
															}}/>
														)}
													</IconButton>
												</InputAdornment>
											),
										}}
										multiline
										rowsMax="4"
										margin="none"
										variant="outlined"
									/>
								)}
							</Field>
						</Grid>
					</Grid>
				</form>
			)}
		</Form>
	);
});
