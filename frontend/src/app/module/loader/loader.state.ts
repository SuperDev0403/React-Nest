export interface WithLoaderState {
	loader: LoaderState;
}

export interface LoaderState {
	[actionType: string]: boolean | undefined;
}

export const INITIAL_STATE: LoaderState = {};
