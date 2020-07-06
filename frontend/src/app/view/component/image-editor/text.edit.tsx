import React, {
	createRef,
	CSSProperties,
	FunctionComponent,
	KeyboardEvent,
	RefObject,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Stage } from 'react-konva';
import Konva from 'konva';

export const TextEdit: FunctionComponent<{
	objectId: string;
	onEditEnd: (text: string) => void
	object: { text: string; x: number; y: number; };
	stageRef: RefObject<Stage>;
	objectRef: RefObject<Konva.Text>;
}> = (props) => {
	const {object, onEditEnd, stageRef, objectRef} = props;
	const inputRef = createRef<HTMLTextAreaElement>();
	const [textAreaStyle, setTextAreaStyle] = useState<undefined | CSSProperties>(undefined);

	const updateSize = useCallback(() => {
		// TODO
	}, []);

	const onKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!inputRef.current) {
			return;
		}
		if (!objectRef || !objectRef.current) {
			return;
		}

		if (e.keyCode === 13 && !e.shiftKey) {
			onEditEnd(inputRef.current?.value || '');
			return;
		}
		if (e.keyCode === 27) {
			onEditEnd(object.text);
			return;
		}

		updateSize();
	}, [inputRef, objectRef, onEditEnd, updateSize, object?.text]);

	const onClickOutside = useCallback((e) => {
		if (!inputRef.current) {
			return;
		}

		if (e.target !== inputRef.current) {
			onEditEnd(inputRef.current?.value || '');
		}
	}, [inputRef, onEditEnd]);

	useEffect(() => {
		if (!inputRef.current) {
			return;
		}
		inputRef.current?.focus();
	}, [inputRef]);

	useEffect(() => {
		setTimeout(() => {
			window.addEventListener('click', onClickOutside);
		});

		return () => {
			window.removeEventListener('click', onClickOutside);
		};
	}, [onClickOutside]);

	useEffect(() => {
		if (!stageRef.current) {
			return;
		}
		if (!objectRef || !objectRef.current) {
			return;
		}

		const stage = stageRef.current?.getStage();
		const textNode = objectRef.current;

		const textPosition = textNode.getAbsolutePosition();
		const stageBox = stage.container().getBoundingClientRect();

		const areaPosition = {
			x: stageBox.left + textPosition.x + window.scrollX,
			y: stageBox.top + textPosition.y + window.scrollY,
		};

		const areaStyle: CSSProperties = {
			position: 'absolute',
			top: areaPosition.y + 'px',
			left: areaPosition.x + 'px',
			width: '100px',
			height: '100px',
			// width: textNode.width() - textNode.padding() * 2 + 'px',
			// height: textNode.height() - textNode.padding() * 2 + 5 + 'px',
			fontSize: textNode.fontSize() + 'px',
			lineHeight: textNode.lineHeight(),
			fontFamily: textNode.fontFamily(),
			color: textNode.fill(),
			border: 'none',
			padding: '0',
			margin: '0',
			overflow: 'hidden',
			background: 'none',
			outline: 'none',
			resize: 'none',
			transformOrigin: 'left top',
			transform: textNode.rotation() ? `rotateZ(${textNode.rotation()}deg)` : undefined,
		};

		// if (!object.text || !object.text.trim().length) {
		//   areaStyle.width = '100px';
		// }

		setTextAreaStyle(areaStyle);
	}, [stageRef, objectRef]);

	if (!textAreaStyle || !object) {
		return null;
	}

	return (
		<textarea
			ref={inputRef}
			style={textAreaStyle}
			onKeyDown={onKeyDown}
			defaultValue={object.text}
		/>
	);
};
