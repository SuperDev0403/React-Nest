const streamRegistry: { [id: string]: MediaStream } = {};

export function hasStream(id: string) {
	return !!streamRegistry[id];
}

export function getStream(id: string) {
	return streamRegistry[id];
}

export function setStream(stream: MediaStream, id?: string) {
	id = id ?? stream.id;

	if (hasStream(id)) {
		throw new Error(`Stream with id "${id} already exists"`);
	}

	streamRegistry[id] = stream;
}
