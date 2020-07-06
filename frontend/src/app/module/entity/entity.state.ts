import { EntityData } from './entity.model';

export interface WithEntityState {
	entity: EntityState
}

export interface EntityState extends EntityData {

}

export const INITIAL_STATE: EntityState = {};
