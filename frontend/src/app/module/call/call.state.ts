import { CallStatus } from './call.model';

export interface CallState {
	isIncoming?: boolean;
	user?: string;
	status?: CallStatus;
	localStreamId?: string;
	remoteStreamId?: string;
}

export const INITIAL_STATE: CallState = {};
