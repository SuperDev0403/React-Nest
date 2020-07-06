import { EntityState } from '../entity/entity.state';
import { getEntityById } from '../entity/entity.selector';
import { ThreadSchema } from './thread.schema';
import { Thread } from '../../../api/model/message';

export const getThreadEntityByUserId = (state: EntityState, userId?: string): Thread | undefined => {
	return getEntityById(
		state, {schema: ThreadSchema, id: userId},
	);
};
