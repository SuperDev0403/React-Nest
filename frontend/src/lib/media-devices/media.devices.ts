export function replaceTracks(stream: MediaStream, newStream: MediaStream, kind?: 'audio' | 'video') {
	if (!kind || kind === 'audio') {
		const rmTracks = stream.getAudioTracks();
		newStream.getAudioTracks().forEach(t => stream.addTrack(t));
		rmTracks.forEach(t => stream.removeTrack(t));
	}
	if (!kind || kind === 'video') {
		const rmTracks = stream.getVideoTracks();
		newStream.getVideoTracks().forEach(t => stream.addTrack(t));
		rmTracks.forEach(t => stream.removeTrack(t));
	}
}

export function stopTracks(stream: MediaStream, kind?: 'audio' | 'video') {
	if (!kind || kind === 'audio') stream.getAudioTracks().forEach(t => t.stop());
	if (!kind || kind === 'video') stream.getVideoTracks().forEach(t => t.stop());
}

export async function getStream(constraints: MediaStreamConstraints, replaceStream?: MediaStream): Promise<{ stream?: MediaStream, error?: Error }> {
	if (!!replaceStream) {
		stopTracks(replaceStream);
	}

	let stream;

	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		console.log('mediaDevices.stream', stream);
	} catch (error) {
		console.log('mediaDevices.error', error);
		return {error};
	}

	if (!!replaceStream) {
		replaceTracks(replaceStream, stream);
		stream = replaceStream;
	}

	return {stream};
}

export function getTrackSettings(track: MediaStreamTrack): { deviceId?: MediaDeviceInfo['deviceId'] } {
	let settings: Partial<MediaTrackSettings> = {deviceId: undefined};

	if (!track) {
		return settings;
	}

	if (track.getSettings) {
		settings = track.getSettings();
	}
	if (settings.deviceId) return settings;

	if (track.getCapabilities) {
		settings.deviceId = track.getCapabilities().deviceId;
	}
	if (settings.deviceId) return settings;

	settings.deviceId = (track.getConstraints()?.deviceId as any)?.exact;
	return settings;
}
