import { EntityState } from '../entity/entity.state';
import { getEntityById } from '../entity/entity.selector';
import { UserSchema } from './user.schema';
import { User } from '../../../api/model/user';
import { WithUserState } from './user.state';
import { createSelector } from 'reselect';

export const getState = (state: WithUserState) => {
	return state.user;
};

export const getUserEntityById = (state: EntityState, id: string | undefined): User | undefined => {
	return getEntityById(
		state, {schema: UserSchema, id},
	);
};

export const createGetUserStatusSelector = () => createSelector(
	getState,
	(_: any, id?: string) => id,
	(userState, id) => {
		return !!id ? userState[id] : undefined;
	},
);
