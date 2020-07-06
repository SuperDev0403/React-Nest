export interface WithAppState {
	app: AppState;
}

export interface AppState {
	hasBootstrapped: boolean;
	error?: Error
}

export const INITIAL_STATE: AppState = {
	hasBootstrapped: false,
};
