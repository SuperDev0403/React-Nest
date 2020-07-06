import React, { createRef, HTMLProps } from 'react';

type VideoProps = { stream?: MediaStream } & HTMLProps<HTMLVideoElement>;

export class Video extends React.Component<VideoProps> {

	ref = createRef<HTMLVideoElement>();

	public getVideoElement() {
		return this.ref.current;
	}

	componentDidMount(): void {
		this.updateStream();
	}

	componentDidUpdate(prevProps: VideoProps): void {
		if (this.props.stream !== prevProps.stream) {
			this.updateStream();
		}
	}

	updateStream() {
		if (!!this.props.stream && !!this.ref.current) {
			this.ref.current.srcObject = this.props.stream;
			this.ref.current.muted = !!this.props.muted;
			this.ref.current.autoplay = !!this.props.autoPlay;

			if (!!this.props.autoPlay) {
				this.ref.current.setAttribute('autoplay', '');
			}
			// neccessary to make videos autoplay on iOS
			if (!!this.props.playsInline) {
				this.ref.current.setAttribute('playsinline', '');
			}
		}
	}

	render() {
		return (
			<video ref={this.ref} {...this.props} />
		);
	}
}
