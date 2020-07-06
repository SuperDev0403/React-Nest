import { User } from '../../user/model/user.entity';

export class Thread {
	id?: string;
	user: User;
	lastMessage?: string;
	newMessageCount?: number;
}
