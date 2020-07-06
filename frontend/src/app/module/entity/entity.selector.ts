// Selector
import { denormalize, schema as Schema } from 'normalizr';
import { EntityState, WithEntityState } from './entity.state';

export const getState = (state: WithEntityState): EntityState => {
	return state.entity;
};

export const getEntityById = (
	state: EntityState,
	{schema, id}: { schema: Schema.Entity, id?: string },
) => {
	if (!id) {
		return undefined;
	}

	return denormalize(id, schema, state);
};

export const getEntityByIdList = (
	state: EntityState,
	{schema, idList}: { schema: Schema.Entity, idList?: string[] },
) => {
	if (!idList) {
		return undefined;
	}

	return denormalize(idList, new Schema.Array(schema), state);
};
