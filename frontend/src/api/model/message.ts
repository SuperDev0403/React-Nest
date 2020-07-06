import { User } from './user';

export enum MessageType {
	TEXT = 'text',
	CALL = 'call',
	IMAGE = 'image',
}

export interface Message {
	id: string;
	type: MessageType,
	threadId: string;
	createdAt: string;
	from: User;
	to: User;
	payload: {
		text?: string;
		startAt?: string;
		endAt?: string;
		imageUrl?: string;
	};
	seenAt?: string;
}

export interface Thread {
	id: string;
	user: User;
	lastMessage?: Message;
	newMessageCount?: number;
}
