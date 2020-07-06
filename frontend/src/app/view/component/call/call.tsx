import { User } from '../../../../api/model/user';
import React, { createRef, CSSProperties, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { getFullName } from '../../../module/user/user.model';
import { Ws } from '../../../../api/sdk-ws/sdk.ws';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthorizedUserSelector } from '../../../module/auth/auth.selector';
import { Video } from './video';
import Peer from 'simple-peer';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { getPeerConnectionConfig } from '../../../../api/sdk/call/get.peer.connection.config';
import { CallStatus } from '../../../module/call/call.model';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ImageEditor } from '../image-editor/image.editor';
import { MessageType } from '../../../../api/model/message';
import { createMessageRequest } from '../../../module/message/message.action';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MessageList } from '../message-list/message.list';

import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import Menu from '@material-ui/core/Menu';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import CallEndOutlinedIcon from '@material-ui/icons/CallEndOutlined';

import { Howl } from 'howler';
import { UserAvatar } from '../user/user.avatar';

import { readUrlAsImage } from '../../../../lib/file/reader';
import PhoneIcon from '@material-ui/icons/PhoneInTalkOutlined';
import { getStream, getTrackSettings, stopTracks } from '../../../../lib/media-devices/media.devices';
import { uploadFile } from '../../../../api/sdk/file/upload.file';

export const STATE_TEXT_MAP = {
	[CallStatus.INITIALIZATION.toString()]: 'Initializing',
	[CallStatus.STAND_BY.toString()]: 'Ready to receive call',
	[CallStatus.STARTING_CALL.toString()]: 'Calling...',
	[CallStatus.NO_ANSWER.toString()]: 'No answer.',
	[CallStatus.CALL_ACCEPTED.toString()]: 'Call accepted, connecting...',
	[CallStatus.CALL_REJECTED.toString()]: 'Call rejected.',
	[CallStatus.RECEIVING_CALL.toString()]: 'Call received',
	[CallStatus.IN_PROGRESS.toString()]: 'Call active',
};

export interface CallData {
	caller: User;
	receiver: User;
	data?: any;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		endCallButton: {
			color: theme.palette.error.main,
		},
		toggleMessagesButton: {
			color: theme.palette.primary.main,
		},
		avatar: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		controlsUpRight: {
			position: 'absolute',
			top: theme.spacing(2),
			right: theme.spacing(2),
			zIndex: 110,
		},
		deviceSelectButton: {
			color: theme.palette.primary.main,
		},
		imageCaptureButtonSmall: {
			position: 'absolute',
			right: 15,
			bottom: 15,
			color: theme.palette.common.white,
			zIndex: 110,
		},
		imageCaptureButtonBig: {
			position: 'absolute',
			top: 10,
			right: 160,
			color: theme.palette.primary.main,
			zIndex: 100,
		},
		imageCaptureButtonLocal: {
			position: 'absolute',
			left: 15,
			bottom: 15,
			zIndex: 110,
			width: 115,
		},
		imageCaptureButtonRemote: {
			position: 'absolute',
			left: 15,
			bottom: 65,
			zIndex: 110,
			width: 115,
		},
		videoBig: {
			backgroundColor: '#f0f0f0',
			display: 'block',
			margin: '0 auto',
			width: '100%',
			height: '100%',
			objectFit: 'contain',
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			zIndex: 100,
		},
		videoSmall: {
			backgroundColor: '#e0e0e0',
			position: 'absolute',
			maxWidth: '150px',
			maxHeight: '150px',
			right: 15,
			bottom: 15,
			borderRadius: 10,
			zIndex: 110,
		},
		userName: {
			fontSize: '4.125rem',
			fontWeight: 'bold',
		},

		userNameImg: {
			width: 200,
			height: 200,
		},
		outgoingCall: {
			minHeight: '700px',
		},

		incomingCall: {
			minHeight: '780px',
		},

		acceptCalls: {
			fontSize: '1rem',
			backgroundColor: '#6CE19C',
			minWidth: '80px',
			minHeight: '80px',
			borderRadius: '100%',
			marginLeft: '30px',
		},

		acceptCallicon: {fontSize: '1.9rem', color: '#fff'},

		acceptCalltxt: {
			fontSize: '1rem',
			textAlign: 'center',
			display: 'block',
			marginTop: '21px',
			color: '#6CE19C',
			marginLeft: '30px',
		},

		declinedCall: {
			fontSize: '1rem',
			backgroundColor: '#E16C6C',
			minWidth: '80px',
			minHeight: '80px',
			borderRadius: '100%',
		},

		declinedCallicon: {fontSize: '1.9rem', color: '#fff'},

		declinedCalltxt: {
			fontSize: '1rem',
			textAlign: 'center',
			display: 'block',
			marginTop: '21px',
			color: '#E16C6C',
		},
		devicesSelect: {},
		selectDevice: {},
		mainCallbox: {
			position: 'inherit',
			top: '0',
			right: '0',
			height: '88vh',
			zIndex: 105,
		},

		[theme.breakpoints.down('lg')]: {

			userNameImg: {
				width: 175,
				height: 175,
			},

			userName: {fontSize: '3.0rem'},

			outgoingCall: {
				minHeight: '470px',
			},

			incomingCall: {
				minHeight: '540px',
			},

			declinedCall: {
				fontSize: '0.95rem',
				minWidth: '60px',
				minHeight: '60px', padding: '0',
			},

			declinedCallicon: {fontSize: '1.5rem'},

			declinedCalltxt: {
				fontSize: '0.95rem',
				marginTop: '18px',
			},

			acceptCalls: {
				fontSize: '0.95rem',
				minWidth: '60px',
				minHeight: '60px', padding: '0',
			},

			acceptCallicon: {fontSize: '1.5rem'},

			acceptCalltxt: {
				fontSize: '0.95rem',
				marginTop: '18px',
			},

			mainCallbox: {
				height: '70vh',
			},

		},

		[theme.breakpoints.down('md')]: {

			userNameImg: {
				width: 125,
				height: 125,
			},

			userName: {fontSize: '2.75rem'},

			outgoingCall: {
				minHeight: '430px',
			},

			incomingCall: {
				minHeight: '460px',
			},

			declinedCall: {
				fontSize: '0.95rem',
				minWidth: '60px',
				minHeight: '60px', padding: '0',
			},

			declinedCallicon: {fontSize: '1.5rem'},

			declinedCalltxt: {
				fontSize: '0.95rem',
				marginTop: '8px',
			},

			acceptCalls: {
				fontSize: '0.95rem',
				minWidth: '60px',
				minHeight: '60px', padding: '0',
			},

			acceptCallicon: {fontSize: '1.5rem'},

			acceptCalltxt: {
				fontSize: '0.95rem',
				marginTop: '8px',
			},

			mainCallbox: {
				height: '60vh',
			},

		},

		[theme.breakpoints.down('sm')]: {
			userName: {fontSize: '1.125rem'},

			userNameImg: {
				width: 95,
				height: 95,
			},

			outgoingCall: {
				minHeight: '420px',
			},

			incomingCall: {
				minHeight: '480px',
			},

			declinedCall: {
				fontSize: '0.75rem',
				minWidth: '45px',
				minHeight: '45px', padding: '0',
			},

			declinedCallicon: {fontSize: '1rem'},

			declinedCalltxt: {
				fontSize: '0.75rem',
				marginTop: '7px',
			},

			acceptCalls: {
				fontSize: '0.65rem',
				minWidth: '45px',
				minHeight: '45px', padding: '0',
			},

			acceptCallicon: {fontSize: '1rem'},

			acceptCalltxt: {
				fontSize: '0.75rem',
				marginTop: '7px',
			},

			mainCallbox: {
				height: '88vh',
			},

		},

	}),
);

export const createCameraImageFileFromCanvas = (canvas): Promise<File> => {
	return new Promise(resolve => {
		canvas.toBlob((blob) => {
			const timestamp = (new Date()).getTime();
			const fileName = `camera-image-${timestamp}.png`;
			const file = new File([blob!], fileName, {lastModified: timestamp});
			resolve(file);
		});
	});
};

export const Call: FunctionComponent<{
	userToCall?: User,
	ws?: Ws,
	onCallStart?: () => void,
	onCallEnd?: () => void,
	onBackClick?: () => void,
	onBackToCallClick?: () => void,
	hidden?: boolean,
}> = (props) => {
	const {userToCall, ws} = props;
	const dispatch = useDispatch();
	const authorizedUser = useSelector(getAuthorizedUserSelector);
	const [localStream, setLocalStream] = useState<MediaStream | undefined>();
	const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
	const [status, setStatus] = useState<CallStatus>(CallStatus.STAND_BY);
	const [peerConnection, setPeerConnection] = useState<Peer.Instance | undefined>();
	const [userOnCall, setUserOnCall] = useState<User | undefined>(undefined);
	const [mediaDeviceMessage, setMediaDeviceMessage] = useState<string | undefined>(undefined);
	const [cameraImage, setCameraImage] = useState<HTMLImageElement | undefined>(undefined);
	const localVideoRef = useMemo(() => createRef<Video>(), []);
	const remoteVideoRef = useMemo(() => createRef<Video>(), []);
	const isScreenShotCanvasActive = !!cameraImage;
	const [callStartAt, setCallStartAt] = useState<undefined | Date>();
	const [mediaDeviceList, setMediaDeviceList] = useState<MediaDeviceInfo[] | undefined>([]);
	const [selectedMediaDevice, setSelectedMediaDevice] = useState<{
		video?: Partial<MediaDeviceInfo>,
		audio?: Partial<MediaDeviceInfo>,
	} | undefined>(undefined);
	const [mainVideoFeed, setMainVideoFeed] = useState<'local' | 'remote'>('remote');
	const [showMessages, setShowMessages] = useState(false);
	const [isCreatingScreenShot, setIsCreatingScreenShot] = useState(false);
	const [isRequestingScreenShot, setIsRequestingScreenShot] = useState(false);

	const ringTone = useMemo(() => {
		return new Howl({
			src: [process.env.PUBLIC_URL + '/media/ringtone.mp3'],
			autoplay: false,
			loop: true,
		});
	}, []);

	const createCallMessage = useCallback((endAt?: Date) => {
		if (!authorizedUser || !userOnCall) {
			return;
		}
		if (!callStartAt) {
			return;
		}

		dispatch(createMessageRequest({
			type: MessageType.CALL,
			fromId: authorizedUser!.id,
			toId: userOnCall?.id,
			startAt: callStartAt,
			endAt: endAt,
		}));
	}, [dispatch, userOnCall, authorizedUser, callStartAt]);

	const createImageMessage = useCallback((imageUrl: string) => {
		if (!authorizedUser || !userOnCall) {
			return;
		}

		dispatch(createMessageRequest({
			type: MessageType.IMAGE,
			fromId: authorizedUser!.id,
			toId: userOnCall?.id,
			imageUrl,
		}));
	}, [dispatch, userOnCall, authorizedUser]);

	const initMediaDeviceList = useCallback(async function() {
		const deviceList = await navigator.mediaDevices.enumerateDevices();
		setMediaDeviceList(deviceList);

		if (!selectedMediaDevice) {
			const video = deviceList.find(d => d.kind === 'videoinput');
			const audio = deviceList.find(d => d.kind === 'audioinput');
			setSelectedMediaDevice({audio, video});
		}
	}, [selectedMediaDevice, setMediaDeviceList, setSelectedMediaDevice]);

	const initLocalStream = useCallback(async function(mediaDevice: typeof selectedMediaDevice) {
		console.log('initLocalStream');

		// set default constraints
		const constraints: Partial<MediaStreamConstraints> = {
			audio: true,
			video: true,
		};

		// update constraints with exact device ID's from the selected device
		if (!!mediaDevice?.audio) {
			constraints.audio = {deviceId: {exact: mediaDevice?.audio?.deviceId}};
		}
		if (!!mediaDevice?.video) {
			constraints.video = {
				...(typeof constraints?.video === 'object' ? constraints?.video : {}),
				deviceId: {exact: mediaDevice?.video?.deviceId},
			};
		}

		// take ref of current video and audio track
		const oldVideoTrack = !!localStream ? localStream.getVideoTracks()[0] : undefined;
		const oldAudioTrack = !!localStream ? localStream.getAudioTracks()[0] : undefined;

		// get video/audio from camera, replace tracks in current stream
		const {stream, error} = await getStream(constraints, localStream);

		setMediaDeviceMessage(error?.message);
		setLocalStream(stream);

		// if no stream yet, set new stream's video track device as selected
		if (!!stream && !localStream) {
			const settings = getTrackSettings(stream.getVideoTracks()[0]);
			setSelectedMediaDevice({video: {deviceId: settings.deviceId}});
		}

		// if there is an ongoing peer connection
		// and if there is a local stream already set up
		// replace old video/audio tracks in it with new ones
		// otherwise just add new stream to peer connection
		if (!!stream && !!peerConnection && status === CallStatus.IN_PROGRESS) {
			if (!!localStream) {
				peerConnection.replaceTrack(oldVideoTrack!, stream.getVideoTracks()[0], localStream);
				peerConnection.replaceTrack(oldAudioTrack!, stream.getAudioTracks()[0], localStream);
			} else {
				peerConnection.addStream(stream);
			}
		}

	}, [localStream, selectedMediaDevice, setMediaDeviceMessage, setLocalStream, peerConnection, status]);

	const updateStreamMediaDevice = useCallback((mediaDevice: typeof selectedMediaDevice) => {
		initLocalStream!(mediaDevice);
	}, [localStream, initLocalStream]);

	const onSelectMediaDevice = useCallback(async (mediaDevice: typeof selectedMediaDevice) => {
		setSelectedMediaDevice(mediaDevice);
		updateStreamMediaDevice(mediaDevice);
	}, [updateStreamMediaDevice, setSelectedMediaDevice]);

	const initializePeerConnection = useCallback(async function(initiator: boolean, callData: CallData) {
		console.log('initializePeerConnection', initiator, callData);

		// get peer confection config from the backend
		const config = await getPeerConnectionConfig();

		// setup peer connection
		const peerConnection = new Peer({
			config,
			initiator,
		});

		// setup peer connection signaling
		peerConnection.on('signal', (data) => {
			console.log('peerConnection.signal', data, peerConnection);

			const {caller, receiver} = callData;
			ws!.emit('call/signal', {caller, receiver, data});
		});

		setPeerConnection(peerConnection);
	}, [ws, setPeerConnection]);

	const startCall = useCallback(async function(callData: CallData) {
		console.log('startCall', callData);

		if (!!userOnCall) {
			return;
		}

		setStatus(CallStatus.STARTING_CALL);
		setUserOnCall(callData.receiver);
		setCallStartAt(new Date());
		props.onCallStart && props.onCallStart();

		await initLocalStream!(selectedMediaDevice);
		await initMediaDeviceList!();

		ws!.emit('call/start', callData);

	}, [userOnCall, setStatus, setUserOnCall, props.onCallStart, initLocalStream, ws, selectedMediaDevice, initMediaDeviceList]);

	const endCall = useCallback(function() {
		console.log('endCall', peerConnection, userOnCall, localStream, remoteStream);

		props.onCallEnd && props.onCallEnd();

		peerConnection && peerConnection.destroy();
		localStream && stopTracks(localStream);
		remoteStream && stopTracks(remoteStream);

		setPeerConnection(undefined);
		setUserOnCall(undefined);
		setLocalStream(undefined);
		setRemoteStream(undefined);
		setCameraImage(undefined);
		setMediaDeviceMessage(undefined);
		setCallStartAt(undefined);
		setStatus(CallStatus.STAND_BY);
		setMainVideoFeed('remote');
		setShowMessages(false);
		setIsRequestingScreenShot(false);
		setIsCreatingScreenShot(false);

		createCallMessage(
			status === CallStatus.IN_PROGRESS ? new Date() : undefined,
		);
	}, [
		peerConnection, setPeerConnection, setUserOnCall, localStream, setMediaDeviceMessage,
		remoteStream, setLocalStream, setRemoteStream, props.onCallEnd, setCameraImage,
		createCallMessage, status,
	]);

	const acceptCall = useCallback(async function() {
		console.log('acceptCall');

		if (!userOnCall) {
			return;
		}

		const callData = {caller: userOnCall!, receiver: authorizedUser!};
		setStatus(CallStatus.CALL_ACCEPTED);

		initializePeerConnection!(false, callData);

		ws!.emit('call/accept', callData);
	}, [userOnCall, authorizedUser, setStatus, initializePeerConnection, ws]);

	const rejectCall = useCallback(async function() {
		console.log('rejectCall');

		if (!userOnCall) {
			return;
		}

		const callData = {caller: userOnCall, receiver: authorizedUser};
		setStatus(CallStatus.CALL_REJECTED);

		ws!.emit('call/reject', callData);

		endCall();
	}, [userOnCall, authorizedUser, setStatus, ws, endCall]);

	const onCallReceived = useCallback(async function(callData: CallData) {
		console.log('onCallReceived', callData);

		if (callData.receiver.id !== authorizedUser!.id) {
			return;
		}
		if (!!userOnCall) {
			return;
		}

		setStatus(CallStatus.RECEIVING_CALL);
		setUserOnCall(callData.caller);
		props.onCallStart && props.onCallStart();

		await initLocalStream!(selectedMediaDevice);
		await initMediaDeviceList!();

	}, [userOnCall, authorizedUser, setStatus, setUserOnCall, props.onCallStart, initLocalStream, initMediaDeviceList, selectedMediaDevice]);

	const onCallAccepted = useCallback(async function(callData: CallData) {
		console.log('onCallAccepted', callData);

		if (callData.caller.id !== authorizedUser!.id) {
			return;
		}

		setStatus(CallStatus.CALL_ACCEPTED);
		setCallStartAt(new Date());

		initializePeerConnection!(true, callData);
	}, [authorizedUser, setStatus, initializePeerConnection]);

	const onCallRejected = useCallback(async function(callData: CallData) {
		console.log('onCallAccepted', callData);

		if (callData.caller.id !== authorizedUser!.id) {
			return;
		}

		setStatus(CallStatus.CALL_REJECTED);
	}, [authorizedUser, setStatus]);

	const onCallSignal = useCallback(function(callData: CallData) {
		console.log('onCallSignal', callData);

		if (!peerConnection || peerConnection.destroyed) {
			return;
		}
		if (
			callData.receiver.id !== authorizedUser!.id &&
			callData.caller.id !== authorizedUser!.id
		) {
			return;
		}

		peerConnection.signal(callData.data);
	}, [peerConnection, authorizedUser]);

	const onCallEstablished = useCallback(function() {
		console.log('onCallEstablished');

		setStatus(CallStatus.IN_PROGRESS);

		if (!!localStream) {
			peerConnection?.addStream(localStream);
		}
	}, [peerConnection, localStream, setStatus]);

	const onCallEnd = useCallback(function(callData: CallData) {
		console.log('onCallEnd', callData, userOnCall);

		if (!userOnCall) {
			return;
		}

		if (
			callData.receiver.id !== userOnCall?.id &&
			callData.caller.id !== userOnCall?.id
		) {
			return;
		}

		endCall();
	}, [userOnCall, endCall]);

	const onEndCallClick = useCallback(function() {
		console.log('onEndCallClick');

		if (!userOnCall) {
			return;
		}

		ws && ws!.emit('call/end', {receiver: userOnCall, caller: authorizedUser});

		endCall();
	}, [userOnCall, ws, endCall, authorizedUser]);

	const captureCameraImageAsFile = useCallback(async () => {
		if (!localStream) {
			return;
		}
		if (localStream.getVideoTracks().length <= 0) {
			return;
		}

		const videoTrack = localStream.getVideoTracks()[0];
		//
		// try {
		// 	await videoTrack.applyConstraints({
		// 		height: {ideal: 2000},
		// 		width: {ideal: 2000},
		// 	});
		// } catch (e) {
		// 	setMediaDeviceMessage(e.message);
		// 	throw e;
		// }
		//
		// await new Promise(resolve => {
		// 	const videoElement = localVideoRef.current?.getVideoElement()! as HTMLVideoElement;
		// 	videoElement.addEventListener('resize', resolve);
		// });
		// await new Promise(resolve => {
		// 	setTimeout(resolve, 1000);
		// });
		//
		const trackSettings = videoTrack.getSettings();
		const videoElement = localVideoRef.current?.getVideoElement()!;

		// put image from video element to canvas
		const canvas = document.createElement('canvas');
		canvas.width = trackSettings.width || 0;
		canvas.height = trackSettings.height! || 0;
		canvas.getContext('2d')!.drawImage(
			videoElement, 0, 0, canvas.width, canvas.height,
		);

		// create image file
		const file = await createCameraImageFileFromCanvas(canvas);

		// initLocalStream(selectedMediaDevice);

		return file;
	}, [localStream, localVideoRef, initLocalStream, selectedMediaDevice]);

	const onLocalSnapshotClick = useCallback(async function() {
		console.log('onLocalSnapshotClick');
		if (!localVideoRef.current) {
			return;
		}

		setIsCreatingScreenShot(true);

		// capture image from camera
		const file = await captureCameraImageAsFile();

		// upload the image
		const uploadResponse = await uploadFile({file: file!});
		const {fileUrl} = uploadResponse;

		// create image element
		const image = await readUrlAsImage(fileUrl);
		image.dataset['createdAt'] = (new Date()).toISOString();

		// start image edit mode
		setIsCreatingScreenShot(false);
		setCameraImage(image);

		// send image to user on call
		ws?.emit('call/screenshot', {
			receiver: userOnCall,
			caller: authorizedUser,
			data: {
				imageUrl: image.src,
				createdAt: image?.dataset['createdAt'],
			},
		});
	}, [localVideoRef, setCameraImage, userOnCall, authorizedUser, ws, captureCameraImageAsFile]);

	const onLocalFileToEditSelected = useCallback(async function(file?: File) {
		console.log('onLocalFileToEditSelected');
		if (!file) {
			return;
		}

		const uploadResponse = await uploadFile({file});
		const {fileUrl} = uploadResponse;

		const image = await readUrlAsImage(fileUrl);
		image.dataset['createdAt'] = (new Date()).toISOString();

		setCameraImage(image);

		ws?.emit('call/screenshot', {
			receiver: userOnCall,
			caller: authorizedUser,
			data: {
				imageUrl: image.src,
				createdAt: image?.dataset['createdAt'],
			},
		});
	}, [ws, setCameraImage, userOnCall, authorizedUser]);

	const onRemoteSnapshotClick = useCallback(async function() {
		console.log('onRemoteSnapshotClick');
		if (!remoteVideoRef.current) {
			return;
		}

		setIsRequestingScreenShot(true);

		// request snapshot from user on call
		ws?.emit('call/screenshot-request', {
			receiver: userOnCall,
			caller: authorizedUser,
		});
	}, [remoteVideoRef, setCameraImage, userOnCall, authorizedUser, ws, captureCameraImageAsFile]);

	const onCallScreenshotRequest = useCallback(function(callData: CallData) {
		console.log('onCallScreenshotRequest', callData, userOnCall);

		if (!userOnCall) {
			return;
		}
		if (callData.receiver.id !== authorizedUser!.id) {
			return;
		}

		onLocalSnapshotClick!();
	}, [userOnCall, authorizedUser, onLocalSnapshotClick]);

	const onSnapshotClose = useCallback(function() {
		setCameraImage(undefined);

		ws?.emit('call/screenshot', {
			receiver: userOnCall,
			caller: authorizedUser,
			data: null,
		});
	}, [setCameraImage, ws, userOnCall, authorizedUser]);

	const onSnapshotSave = useCallback(async function(canvas: HTMLCanvasElement) {
		onSnapshotClose();

		// upload image
		const file = await createCameraImageFileFromCanvas(canvas);
		const uploadResponse = await uploadFile({file: file!});
		const {fileUrl: imageUrl} = uploadResponse;

		// create new image message
		await createImageMessage(imageUrl);

	}, [onSnapshotClose, createImageMessage]);

	// called when camera image is received from user on call
	const onCallScreenshotReceived = useCallback(async function(callData: CallData) {
		if (callData.receiver.id !== authorizedUser?.id) {
			return;
		}

		setIsRequestingScreenShot(false);

		// close edit mode if user on call closed editor
		if (!callData.data) {
			setCameraImage(undefined);
			return;
		}

		// if local user started image edit before received image edit event
		// do nothing
		if (!!cameraImage && cameraImage?.dataset['createdAt']! <= callData.data.createdAt) {
			return;
		}

		// start edit mode
		const image = await readUrlAsImage(callData.data.imageUrl);
		setCameraImage(image);

	}, [userOnCall, authorizedUser, setCameraImage]);

	const onVideoChangeClick = useCallback(() => {
		setMainVideoFeed(mainVideoFeed === 'remote' ? 'local' : 'remote');
	}, [mainVideoFeed, setMainVideoFeed]);

	// setup WS event handlers
	useEffect(() => {
		if (!ws) {
			return;
		}

		ws.on('call/start', onCallReceived);
		ws.on('call/signal', onCallSignal);
		ws.on('call/accept', onCallAccepted);
		ws.on('call/reject', onCallRejected);
		ws.on('call/end', onCallEnd);
		ws.on('call/screenshot', onCallScreenshotReceived);
		ws.on('call/screenshot-request', onCallScreenshotRequest);

		return () => {
			ws.off('call/start');
			ws.off('call/signal');
			ws.off('call/accept');
			ws.off('call/reject');
			ws.off('call/end');
			ws.off('call/screenshot');
			ws.off('call/screenshot-request');
		};
	}, [ws, onCallReceived, onCallSignal, onCallAccepted, onCallEnd, onCallRejected, onCallScreenshotReceived, onCallScreenshotRequest]);

	// setup peer connection event handlers
	useEffect(() => {
		if (!peerConnection) {
			return;
		}

		peerConnection.on('stream', (stream) => {
			console.log('peerConnection.stream', stream);
			setRemoteStream(stream);
		});

		peerConnection.on('connect', (e: any) => {
			console.log('peerConnection.connect', e);
			onCallEstablished();
		});

		peerConnection.on('close', (e: any) => {
			console.log('peerConnection.close', e);
		});

		peerConnection.on('data', (data) => console.log('peerConnection.data', data));
		peerConnection.on('iceStateChange', (data) => console.log('peerConnection.iceStateChange', data));
		peerConnection.on('negotiate', () => console.log('peerConnection.negotiate'));
		peerConnection.on('signalingStateChange', () => console.log('peerConnection.signalingStateChange'));
		peerConnection.on('_iceComplete', () => console.log('peerConnection._iceComplete'));
		peerConnection.on('iceTimeout', () => console.log('peerConnection.iceTimeout'));

		peerConnection.on('error', (error) => {
			console.error('peerConnection.error', error, JSON.stringify(error), JSON.stringify(peerConnection));
		});
	}, [peerConnection, setRemoteStream, onCallEstablished]);

	// start call when userToCall is specified and no call is in progress
	useEffect(() => {
		if (!ws) {
			return;
		}

		if (!userOnCall && !!userToCall) {
			startCall!({caller: authorizedUser!, receiver: userToCall});
		}
	}, [ws, userToCall, userOnCall, startCall, authorizedUser]);

	// setup repeated call requests when calling another user
	useEffect(() => {
		if (status !== CallStatus.STARTING_CALL) {
			return;
		}
		if (!userOnCall) {
			return;
		}

		const timeout = setTimeout(function() {
			setStatus(CallStatus.NO_ANSWER);
		}, 180000);

		const interval = setInterval(function() {
			ws!.emit('call/start', {caller: authorizedUser, receiver: userOnCall});
		}, 10000);

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, [status, userOnCall, authorizedUser, setStatus, ws]);

	// setup end call timeout when no answer received from called user
	useEffect(() => {
		if (
			status !== CallStatus.NO_ANSWER &&
			status !== CallStatus.CALL_REJECTED
		) {
			return;
		}

		const timeout = setTimeout(function() {
			onEndCallClick();
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, [status, onEndCallClick]);

	// setup ringing when calling user
	useEffect(() => {
		if (status !== CallStatus.RECEIVING_CALL) {
			return;
		}

		ringTone.play();

		return () => {
			ringTone.stop();
		};
	}, [status, ringTone]);

	const classes = useStyles();

	// if no user on call or in stand by mode, do not render anything
	if (status === CallStatus.STAND_BY || status === CallStatus.INITIALIZATION || !userOnCall) {
		return null;
	}

	const errorMessage = () => !!mediaDeviceMessage ? (
		<Alert color="error">
			{mediaDeviceMessage}
		</Alert>
	) : null;

	const appBar = () => (
		<AppBar position="static" color="default" elevation={0}>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={props.onBackClick}
				>
					<KeyboardBackspaceOutlinedIcon style={{fill: '#115293'}}/>
				</IconButton>
				<UserAvatar
					className={classes.avatar}
					user={userOnCall}
				/>
				<div className={classes.title}>
					<Typography variant="h6" noWrap={true}>
						{getFullName(userOnCall)}
					</Typography>
					<Typography variant="caption">
						{STATE_TEXT_MAP[status.toString()] || status}
					</Typography>
				</div>
				<IconButton
					className={classes.toggleMessagesButton}
					onClick={() => setShowMessages(!showMessages)}
				>
					{showMessages ? (
						<VideocamOutlinedIcon/>
					) : (
						<ForumOutlinedIcon/>
					)}
				</IconButton>
				<IconButton
					className={classes.endCallButton}
					onClick={onEndCallClick}
				>
					<CallEndOutlinedIcon/>
				</IconButton>
			</Toolbar>
		</AppBar>
	);

	const deviceSelect = () => (
		<FormControl margin="none" variant="outlined" style={{width: '100%'}} className={classes.devicesSelect}>
			<InputLabel id="demo-simple-select-label"/>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				style={{height: '50px'}}
				value={selectedMediaDevice?.video?.deviceId ?? mediaDeviceList?.[0]?.deviceId}
				onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
					onSelectMediaDevice!({
						...(selectedMediaDevice || {}),
						video: mediaDeviceList?.find(d => d.deviceId === event.target.value as string),

					});
				}}
			>
				{mediaDeviceList?.filter(d => d.kind === 'videoinput')?.map((d) => (
					<MenuItem key={d.deviceId} value={d.deviceId}>
						<Typography noWrap={true}>
							{d.label || (d.kind + ': id = ' + (d.deviceId || 'Default'))}
						</Typography>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	const controlsUpRight = () => (
		<div className={classes.controlsUpRight}>
			<Grid item style={{
				alignSelf: 'flex-start', flex: 1,
				flexDirection: 'row',
				textAlign: 'right',
				justifyContent: 'flex-end',
				marginTop: '15px',
			}}>
				<PopupState variant="popover" popupId="demo-popup-menu">
					{popupState => (
						<React.Fragment>
							<Button
								style={{marginRight: '15px'}}
								variant="outlined"
								className={classes.deviceSelectButton}
								{...bindTrigger(popupState) as any}
							>
								<VideocamOutlinedIcon/>
								<ArrowDropDownOutlinedIcon/>
							</Button>
							<Menu {...bindMenu(popupState)}>
								{mediaDeviceList?.filter(d => d.kind === 'videoinput')?.map((d) => (
									<MenuItem
										key={d.deviceId}
										value={d.deviceId}
										onClick={() => {
											onSelectMediaDevice!({
												...(selectedMediaDevice || {}),
												video: d,
											});
											popupState.close();
										}}
									>
										<Typography noWrap={true}>
											{d.label || (d.kind + ': id = ' + (d.deviceId || 'Default'))}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</React.Fragment>

					)}
				</PopupState>

				{/*<input*/}
				{/*	onChange={(event: ChangeEvent<HTMLInputElement>) => onLocalFileToEditSelected(event.target.files?.[0])}*/}
				{/*	color="primary"*/}
				{/*	accept="image/*"*/}
				{/*	type="file"*/}
				{/*	id="icon-button-file-1"*/}
				{/*	style={{display: 'none'}}*/}
				{/*/>*/}
				{/*<label htmlFor="icon-button-file-1">*/}
				{/*	<Button*/}
				{/*		variant="outlined"*/}
				{/*		component="span"*/}
				{/*		color="primary"*/}
				{/*	>*/}
				{/*		<AttachFileOutlinedIcon/>*/}
				{/*	</Button>*/}
				{/*</label>*/}
			</Grid>
		</div>
	);

	const mainCallBox = () => (
		<>
			{!remoteStream && (
				<div className={classes.mainCallbox}>
					<Grid
						item
						className={classes.outgoingCall}
						container
						direction="column"
						justify="space-evenly"
						alignItems="center"

					>
						<Grid item>
							<UserAvatar className={classes.userNameImg} user={userOnCall}/>
						</Grid>
						<Grid item>
							<Typography variant="h4" className={classes.userName}>
								{getFullName(userOnCall)}
							</Typography>
						</Grid>
						<Typography variant="body2">Outgoing call</Typography>
						<Grid item style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<Grid style={{flexDirection: 'column'}}>
								<Button
									variant="contained" className={classes.declinedCall} onClick={rejectCall}>
									<CallEndOutlinedIcon className={classes.declinedCallicon}/>
								</Button>
								<span className={classes.declinedCalltxt}>Abort</span>
							</Grid>
						</Grid>
					</Grid>
				</div>
			)}
		</>
	);

	const incomingCallDisplay = () => (
		<Grid
			item
			className={classes.incomingCall}
			container
			direction="column"
			justify="space-evenly"
			alignItems="center"

		>
			<Grid item>
				<UserAvatar
					className={classes.userNameImg}
					user={userOnCall}
				/>
			</Grid>

			<Grid item>
				<Typography variant="h4" className={classes.userName}>
					{getFullName(userOnCall)}
				</Typography>
			</Grid>
			<Typography variant="body2">
				Incoming call
			</Typography>
			<Grid item>
				<div style={{width: 250}}>
					{deviceSelect()}
				</div>
			</Grid>
			<Grid item style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
				<Grid style={{flexDirection: 'column'}}>
					<Button

						variant="contained" className={classes.declinedCall} onClick={rejectCall}>
						<CallEndOutlinedIcon className={classes.declinedCallicon}/>
					</Button>
					<span className={classes.declinedCalltxt}>Decline</span>
				</Grid>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<Grid style={{flexDirection: 'column'}}>
					<Button

						variant="contained" className={classes.acceptCalls} onClick={acceptCall}>
						<PhoneIcon className={classes.acceptCallicon}/>
					</Button>
					<span className={classes.acceptCalltxt}>Accept</span>

				</Grid>
			</Grid>
		</Grid>
	);

	const remoteVideo = () => (
		<Video
			ref={remoteVideoRef as any}
			stream={remoteStream}
			onClick={onVideoChangeClick}
			autoPlay={true}
			playsInline={true}
			style={{marginBottom: '25px'}}
			className={mainVideoFeed === 'remote' ? classes.videoBig : classes.videoSmall}
		/>
	);

	const remoteImageCaptureButton = () => (
		<Button
			variant="contained"
			color="primary"
			className={classes.imageCaptureButtonRemote}
			onClick={() => onRemoteSnapshotClick()}
			disabled={isCreatingScreenShot}
		>
			<CameraAltOutlinedIcon/>&nbsp;Remote
		</Button>
	);

	const localVideo = () => (
		<Video
			ref={localVideoRef as any}
			stream={localStream}
			onClick={onVideoChangeClick}
			autoPlay={true}
			muted={true}
			playsInline={true}
			style={{marginBottom: '25px'}}
			className={mainVideoFeed === 'local' ? classes.videoBig : classes.videoSmall}
		/>
	);

	const localImageCaptureButton = () => (
		<Button
			variant="contained"
			color="primary"
			className={classes.imageCaptureButtonLocal}
			onClick={() => onLocalSnapshotClick()}
			disabled={isCreatingScreenShot}
		>
			<CameraAltOutlinedIcon/>&nbsp;Local
		</Button>
	);

	const capturedImageEditor = () => (
		<ImageEditor
			image={cameraImage!}
			onDiscardClick={onSnapshotClose}
			onSaveClick={onSnapshotSave}
			ws={ws}
			authorizedUser={authorizedUser!}
			userOnCall={userOnCall}
		/>
	);

	const messageList = () => (
		<MessageList
			userToMessage={userOnCall}
			hideAppBar={true}
		/>
	);

	const gridStyle: Partial<CSSProperties> = {flexGrow: 1, position: 'relative'};

	if (props.hidden) {
		gridStyle.display = 'none';
	}

	return (
		<>
			<Grid item hidden={!props.hidden}>
				<Alert color="success">
					Call in progress.
					&nbsp;&nbsp;
					<Button variant="text" onClick={props.onBackToCallClick}>
						Go back to call.
					</Button>
				</Alert>
			</Grid>
			<Grid
				container
				item
				style={gridStyle}
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={0}
				hidden={props.hidden}
			>
				<Grid item style={{flex: 'none'}}>
					{appBar()}
				</Grid>

				<Grid item style={{flex: 'none'}}>
					{errorMessage()}

					{isCreatingScreenShot && (
						<Alert color="info">
							Creating Camera Snap, please wait ...
						</Alert>
					)}
					{isRequestingScreenShot && (
						<Alert color="info">
							Requesting Camera Snap, please wait ...
						</Alert>
					)}
				</Grid>

				{status === CallStatus.RECEIVING_CALL && (
					incomingCallDisplay()
				)}

				{status !== CallStatus.RECEIVING_CALL && (
					<Grid
						hidden={isScreenShotCanvasActive || showMessages}
						item
						style={{
							flexGrow: 1,
							width: '100%',
							height: 0,
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{localVideo()}
						{remoteVideo()}
						{controlsUpRight()}
						{mainCallBox()}
						{!!localStream && localImageCaptureButton()}
						{!!remoteStream && remoteImageCaptureButton()}
					</Grid>
				)}

				{showMessages && (
					messageList()
				)}

				{!!cameraImage && (
					capturedImageEditor()
				)}
			</Grid>
		</>
	);
};
