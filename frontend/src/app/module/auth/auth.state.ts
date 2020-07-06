import { User } from '../../../api/model/user';

export interface WithAuthState {
	auth: AuthState;
}

export interface AuthState {
	user?: User['id'];
}

export const INITIAL_STATE: AuthState = {};
