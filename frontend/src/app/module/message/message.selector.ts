import { EntityState } from '../entity/entity.state';
import { getEntityById } from '../entity/entity.selector';
import { MessageSchema } from './message.schema';
import { Message } from '../../../api/model/message';

export const getMessageEntityById = (state: EntityState, id: string | undefined): Message | undefined => {
	return getEntityById(
		state, {schema: MessageSchema, id: id},
	);
};
