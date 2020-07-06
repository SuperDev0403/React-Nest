import { schema } from 'normalizr';

export const UserSchema = new schema.Entity('user');

export const UserListSchema = new schema.Array(UserSchema);