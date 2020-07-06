import { EntityState, INITIAL_STATE } from './entity.state';
import { NormalizedSchema } from 'normalizr';
import { PayloadAction } from '@reduxjs/toolkit';
import { EntityData, EntityMergeMode } from './entity.model';
import merge from 'lodash/merge';

export const entityReducer = function(
	state: EntityState = INITIAL_STATE,
	action: PayloadAction<NormalizedSchema<EntityData, any>,
		string,
		{ mergeMode?: string }>,
) {
	if (!(action.payload && action.payload.entities)) {
		return state;
	}

	const {entities} = action.payload;
	const isReplaceMergeMode = action.meta && action.meta.mergeMode === EntityMergeMode.REPLACE;

	state = {...state};

	for (let entityName of Object.keys(entities)) {
		state[entityName] = {...state[entityName]};

		for (let entityId of Object.keys(entities[entityName])) {
			if (isReplaceMergeMode) {
				state[entityName][entityId] = entities[entityName][entityId];
			} else {
				state[entityName][entityId] = merge({}, state[entityName][entityId], entities[entityName][entityId]);
			}
		}
	}

	return state;
};
