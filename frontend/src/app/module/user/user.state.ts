import { UserStatus } from './user.model';

export interface WithUserState {
	user: UserState;
}

export interface UserState {
	[userId: string]: UserStatus | undefined
}

export const INITIAL_STATE: UserState = {};
