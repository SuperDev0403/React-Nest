import { schema } from 'normalizr';
import { UserSchema } from '../user/user.schema';
import { Thread } from '../../../api/model/message';
import { MessageSchema } from '../message/message.schema';

export const ThreadSchema = new schema.Entity('thread', {
	user: UserSchema,
	lastMessage: MessageSchema,
}, {
	idAttribute: (value: Thread) => value.user.id,
});

export const ThreadListSchema = new schema.Array(ThreadSchema);
