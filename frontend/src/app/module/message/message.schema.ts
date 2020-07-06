import { schema } from 'normalizr';
import { UserSchema } from '../user/user.schema';

export const MessageSchema = new schema.Entity('message', {
	from: UserSchema,
	to: UserSchema,
});

export const MessageListSchema = new schema.Array(MessageSchema);
