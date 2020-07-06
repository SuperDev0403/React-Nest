import { Message } from '../../model/message';

export const getMessageImageUrl = (message: Message) => {
	return message.payload?.imageUrl;
};
