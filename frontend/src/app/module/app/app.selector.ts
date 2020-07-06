// Selector
import { AppState, WithAppState } from './app.state';
import { createSelector } from 'reselect';

export const getState = (state: WithAppState): AppState => {
	return state.app;
};

export const hasBootstrapped = createSelector(
	[getState], state => state.hasBootstrapped,
);

export const getBootstrapError = createSelector(
	[getState], state => state.error,
);
