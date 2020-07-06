import { WithLoaderState } from './loader.state';
import { createSelector } from 'reselect';

export const getState = (state: WithLoaderState) => {
	return state.loader;
};

export const createIsLoadingSelector = () => createSelector(
	getState,
	(_: any, actionType: string) => actionType,
	(loadingState, actionType) => {
		return !!loadingState[actionType];
	},
);

export const isLoadingSelector = (state: WithLoaderState, actionType: string): boolean => {
	const loadingState = getState(state);
	return !!loadingState[actionType];
};
