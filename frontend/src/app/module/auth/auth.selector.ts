// Selector
import { createSelector } from 'reselect';
import { AuthState, WithAuthState } from './auth.state';
import { getUserEntityById } from '../user/user.selector';
import { WithEntityState } from '../entity/entity.state';
import { getState as getEntityState } from '../entity/entity.selector';

export const getState = (state: WithAuthState & WithEntityState): AuthState => {
	return state.auth;
};

export const isUserLoggedInSelector = createSelector(
	[getState], state => !!state.user,
);

export const getAuthorizedUserSelector = createSelector(
	[getState, getEntityState],
	(authState, entityState) => getUserEntityById(entityState, authState.user),
);
