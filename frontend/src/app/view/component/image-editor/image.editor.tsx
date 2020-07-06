import React, {
	createRef,
	CSSProperties,
	FunctionComponent,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Image, Layer, Line, Stage, Text } from 'react-konva';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@material-ui/core/Grid';
import { TextEdit } from './text.edit';
import { ButtonGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Ws } from '../../../../api/sdk-ws/sdk.ws';
import { CallData } from '../call/call';
import { User } from '../../../../api/model/user';

const useStyles = makeStyles(() =>
	createStyles({
		canvasContainer: {},
		canvasControls: {
			padding: '10px',
		},
	}),
);

function getScaledPointerPosition(stage: Konva.Stage) {
	const pointerPosition = stage.getPointerPosition();
	const scale = stage.getAbsoluteScale();
	const position = stage.getAbsolutePosition();

	const x = (pointerPosition!.x - position.x) / scale.x;
	const y = (pointerPosition!.y - position.y) / scale.y;

	return {x: x, y: y};
}

export interface ImageEditorProps {
	image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas,
	onSaveClick?: (canvas: HTMLCanvasElement) => void;
	onDiscardClick?: () => void;
	authorizedUser: User,
	userOnCall: User,
	ws?: Ws,
}

export const ImageEditor: FunctionComponent<ImageEditorProps> = (
	{
		image,
		onSaveClick,
		onDiscardClick,
		ws,
		userOnCall,
		authorizedUser,
	},
) => {
	const classes = useStyles();

	const stageRef = createRef<Stage>();
	const stageContainerRef = createRef<HTMLDivElement>();

	const [activeTool, setActiveTool] = useState<'pen' | 'text' | 'delete' | undefined>('pen');
	const isPenActive = useMemo(() => activeTool === 'pen', [activeTool]);
	const isTextActive = useMemo(() => activeTool === 'text', [activeTool]);
	const isDeleteActive = useMemo(() => activeTool === 'delete', [activeTool]);

	const [objectStore, setObjectStore] = useState<{
		[uuid: string]: { points: number[], createdBy: string, erase?: boolean } | { text: string; x: number; y: number; createdBy: string };
	}>({});

	const [toolDrawState, setToolDrawState] = useState<{
		isDrawing?: boolean,
		objectId?: string,
	}>({});

	// create map from object ID to DOM object reference
	const objectRef: { [objectId: string]: RefObject<Konva.Text> } = useMemo(() => {
		return Object.keys(objectStore).reduce((carry: any, value: string) => {
			carry[value] = createRef<Konva.Text>();
			return carry;
		}, {});
	}, [objectStore]);

	const stageStyle: CSSProperties = useMemo(() => {
		if (isPenActive) {
			return {cursor: 'crosshair'};
		}
		return {};
	}, [isPenActive]);

	/*
	 * Connection events
	 */
	const onObjectChange = useCallback(function(objectId: string, object?: object) {
		ws?.emit('call/screenshot/annotation', {
			receiver: userOnCall,
			caller: authorizedUser,
			data: {objectId, object},
		});
	}, [ws, userOnCall, authorizedUser]);

	// called when object change event is received via WS
	const onCallObjectChangeReceived = useCallback(function(callData: CallData) {
		// check if user on call is the sender
		if (
			callData.receiver.id !== userOnCall!.id &&
			callData.caller.id !== userOnCall!.id
		) {
			return;
		}

		// update object store
		const {objectId, object} = callData.data;

		const newObjectStore = {...objectStore};
		const shouldDeleteObject = !object;

		if (shouldDeleteObject) {
			delete newObjectStore[objectId];
		} else {
			newObjectStore[objectId] = {...object, remote: true};
		}

		setObjectStore(newObjectStore);
	}, [userOnCall, objectStore, setObjectStore]);

	// setup ws event handlers
	useEffect(function() {
		if (!ws) {
			return;
		}

		ws.on('call/screenshot/annotation', onCallObjectChangeReceived);

		return () => {
			ws.off('call/screenshot/annotation');
		};
	}, [ws, onCallObjectChangeReceived]);

	/*
	 * Object
	 */
	const removeObject = useCallback((objectId) => {
		const newObjectStore = {...objectStore};
		delete newObjectStore[objectId];
		setObjectStore(newObjectStore);

		onObjectChange?.(objectId, undefined);
	}, [objectStore, setObjectStore, onObjectChange]);

	/*
	 * Line Draw actions
	 */
	const lineDrawStart = useCallback((options: { erase?: boolean } = {}) => {
		if (!stageRef.current) {
			return;
		}
		if (toolDrawState.isDrawing) {
			return;
		}

		const stage = stageRef.current.getStage();
		const position = getScaledPointerPosition(stage);

		const objectId = uuidv4();
		const object = {
			points: [position?.x!, position?.y!],
			createdBy: authorizedUser.id,
			erase: options.erase,
		};

		setToolDrawState({
			isDrawing: true,
			objectId,
		});

		setObjectStore({
			...objectStore,
			[objectId]: object,
		});

		onObjectChange?.(objectId, object);
	}, [stageRef, toolDrawState, setToolDrawState, objectStore, setObjectStore, onObjectChange, authorizedUser]);

	const lineDrawEnd = useCallback(() => {
		if (!toolDrawState.isDrawing) {
			return;
		}
		setToolDrawState({});
	}, [toolDrawState, setToolDrawState]);

	const lineDrawMove = useCallback(() => {
		if (!stageRef.current) {
			return;
		}
		if (!toolDrawState.isDrawing) {
			return;
		}
		if (!toolDrawState.objectId) {
			return;
		}

		const stage = stageRef.current.getStage();
		const position = getScaledPointerPosition(stage);

		const objectId = toolDrawState.objectId;
		const object = {...objectStore[objectId]};

		if ('points' in object) {
			object.points = object.points.concat([position?.x!, position?.y!]);
		}

		setObjectStore({
			...objectStore,
			[objectId]: object,
		});

		onObjectChange?.(objectId, object);
	}, [stageRef, toolDrawState, objectStore, setObjectStore, onObjectChange]);

	/*
	 * Text Draw actions
	 */
	const textEditStart = useCallback((objectId: string) => {
		if (toolDrawState.isDrawing) {
			return;
		}

		setToolDrawState({
			isDrawing: true,
			objectId,
		});
	}, [toolDrawState]);

	const textEditEnd = useCallback((text: string) => {
		if (!toolDrawState.isDrawing) {
			return;
		}
		if (!toolDrawState.objectId) {
			return;
		}

		const objectId = toolDrawState.objectId;
		let object = {...objectStore[objectId]};

		if ('text' in object) {
			object.text = text;
		}

		const newObjectStore = {...objectStore};
		const shouldDeleteObject = !text || !text.trim().length;

		if (shouldDeleteObject) {
			delete newObjectStore[objectId];
		} else {
			newObjectStore[objectId] = object;
		}

		setObjectStore(newObjectStore);
		setToolDrawState({});

		onObjectChange?.(objectId, shouldDeleteObject ? undefined : object);
	}, [toolDrawState, objectStore, setObjectStore, onObjectChange]);

	const textTransform = useCallback((objectId, data: { x?: number, y?: number }) => {
		const object = {
			...objectStore[objectId],
			...data,
		};

		setObjectStore({
			...objectStore,
			[objectId]: object,
		});

		onObjectChange?.(objectId, object);
	}, [objectStore, setObjectStore, onObjectChange]);

	const textAdd = useCallback(() => {
		if (!stageRef.current) {
			return;
		}
		if (toolDrawState.isDrawing) {
			return;
		}

		const stage = stageRef.current.getStage();
		const position = getScaledPointerPosition(stage);

		const objectId = uuidv4();
		const object = {
			text: '',
			x: position?.x!, y: position?.y!,
			createdBy: authorizedUser.id,
		};

		setObjectStore({
			...objectStore,
			[objectId]: object,
		});

		onObjectChange?.(objectId, object);

		textEditStart(objectId);
	}, [stageRef, toolDrawState, objectStore, setObjectStore, textEditStart, onObjectChange, authorizedUser]);

	/*
	 * Event handlers
	 */
	const onStageMouseDown = useCallback(() => {
		if (isPenActive || isDeleteActive) {
			lineDrawStart({erase: isDeleteActive});
		}
		// nothing
	}, [isPenActive, lineDrawStart]);

	const onStageMouseUp = useCallback(() => {
		if (isPenActive || isDeleteActive) {
			lineDrawEnd();
		}
	}, [isPenActive, lineDrawEnd]);

	const onStageMouseMove = useCallback(() => {
		if (isPenActive || isDeleteActive) {
			lineDrawMove();
		}
	}, [isPenActive, lineDrawMove]);

	const onStageMouseClick = useCallback(() => {
		if (isTextActive) {
			textAdd();
		}
	}, [isTextActive, textAdd]);

	const onStageMouseEnter = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
		if ((isPenActive || isDeleteActive) && toolDrawState.isDrawing && e.evt.buttons !== 1) {
			lineDrawEnd();
		}
	}, [isPenActive, toolDrawState]);

	const onTextClick = useCallback((objectId) => {
		if (isTextActive) {
			textEditStart(objectId);
		} else if (isDeleteActive) {
			removeObject(objectId);
		}
	}, [isTextActive, textEditStart, isDeleteActive, removeObject]);

	const onLineClick = useCallback((objectId) => {
		if (isDeleteActive) {
			removeObject(objectId);
		}
	}, [isDeleteActive, removeObject]);

	const onTextMove = useCallback((objectId, position: { x: number, y: number }) => {
		if (isTextActive) {
			textTransform(objectId, position);
		}
	}, [isTextActive, textTransform]);

	const onToolSelect = useCallback((tool: typeof activeTool) => {
		setActiveTool(tool);
		setToolDrawState({});
	}, [setActiveTool, setToolDrawState]);

	const onSaveButtonClick = useCallback(() => {
		if (!stageRef.current) {
			return;
		}

		// clone current stage
		const stage = stageRef.current.getStage().clone({}) as Konva.Stage;

		// set original sizes to new stage and scale it to default scale
		stage.size({
			width: image.width,
			height: image.height,
		});
		stage.scale({x: 1, y: 1});
		stage.draw();

		// convert stage to single canvas element
		const canvas = stage.toCanvas({});
		onSaveClick?.(canvas);
	}, [stageRef, onSaveClick]);

	const [scale, setScale] = useState({x: 0, y: 0});

	const updateScale = useCallback(() => {
		if (!stageContainerRef.current) {
			return;
		}

		const container = stageContainerRef.current;
		let scaleValue = container.offsetWidth / image.width;

		if (container.offsetHeight < image.height * scaleValue) {
			scaleValue = container.offsetHeight / image.height;
		}

		setScale({x: scaleValue, y: scaleValue});
	}, [stageContainerRef.current, image, setScale]);

	// update container scale to fit image in the container element
	useEffect(() => {
		updateScale();
	}, [stageContainerRef.current]);

	return (
		<Grid
			container
			item
			style={{flexGrow: 1, width: '100%', height: 0, overflow: 'auto'}}
			direction="column"
			justify="center"
			alignItems="stretch"
			spacing={0}
		>
			<Grid
				container
				item
				style={{flexGrow: 1, width: '100%', height: 0, overflow: 'auto'}}
				direction="column"
				justify="center"
				alignItems="center"
				spacing={0}
				ref={stageContainerRef}
			>
				<Stage
					style={{
						...stageStyle,
					}}
					ref={stageRef}
					width={image.width * scale.x}
					height={image.height * scale.y}
					scale={scale}
					onMouseDown={onStageMouseDown}
					onTouchStart={onStageMouseDown}
					onMouseUp={onStageMouseUp}
					onTouchEnd={onStageMouseUp}
					onMouseMove={onStageMouseMove}
					onTouchMove={onStageMouseMove}
					onClick={onStageMouseClick}
					onTap={onStageMouseClick}
					onMouseEnter={onStageMouseEnter}
				>
					<Layer>
						<Image
							image={image}
						/>
					</Layer>
					<Layer>
						{Object.keys(objectStore).map(objectId => {
							const object = objectStore[objectId];
							const isRemote = authorizedUser.id !== object.createdBy;

							if ('points' in object) {
								return (
									<Line
										key={objectId}
										stroke={isRemote ? '#E16C6C' : '#6CE19C'}
										strokeWidth={(object.erase ? 20 : 2) * (scale.x ? (1 / scale.x) : 1)}
										globalCompositeOperation={object.erase ? 'destination-out' : 'source-over'}
										points={object.points}
										onClick={object.erase ? undefined : () => onLineClick(objectId)}
									/>
								);
							}

							if ('text' in object) {
								return (
									<Text
										visible={!(isTextActive && toolDrawState.isDrawing && toolDrawState.objectId === objectId)}
										ref={objectRef[objectId]}
										onDragMove={(e) => onTextMove(objectId, {
											x: e.target.x(),
											y: e.target.y(),
										})}
										onClick={() => onTextClick(objectId)}
										onTap={() => onTextClick(objectId)}
										draggable
										key={objectId}
										fill={isRemote ? '#E16C6C' : '#6CE19C'}
										fontSize={18}
										globalCompositeOperation={'source-over'}
										x={object.x}
										y={object.y}
										text={object.text}
										scaleX={scale.x ? (1 / scale.x) : undefined}
										scaleY={scale.y ? (1 / scale.y) : undefined}
									/>
								);
							}

							return null;
						})}
					</Layer>
				</Stage>
				{isTextActive && toolDrawState.isDrawing && (
					<TextEdit
						objectId={toolDrawState.objectId!}
						object={objectStore[toolDrawState.objectId!] as any}
						objectRef={objectRef[toolDrawState.objectId!]!}
						stageRef={stageRef}
						onEditEnd={textEditEnd}
					/>
				)}
			</Grid>

			<Grid
				item
				container
				style={{flex: 'none'}}
				direction="row"
				justify="center"
				alignItems="center"
				className={classes.canvasControls}
			>
				<Grid item style={{padding: '5px 10px'}}>
					<ButtonGroup>
						<Button
							disableElevation={true}
							color="primary"
							variant={isPenActive ? 'contained' : 'outlined'}
							onClick={() => onToolSelect('pen')}
						>
							<CreateIcon/>
						</Button>
						<Button
							disableElevation={true}
							color="primary"
							variant={isTextActive ? 'contained' : 'outlined'}
							onClick={() => onToolSelect('text')}
						>
							<TextFieldsIcon/>
						</Button>
						<Button
							disableElevation={true}
							color="primary"
							variant={isDeleteActive ? 'contained' : 'outlined'}
							onClick={() => onToolSelect('delete')}
						>
							<DeleteIcon/>
						</Button>
					</ButtonGroup>
				</Grid>

				<Grid item style={{padding: '5px 10px'}}>
					<Button color="primary" variant="contained" onClick={onSaveButtonClick}>
						Save
					</Button>
					<Button color="secondary" onClick={onDiscardClick}>
						Discard
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};
