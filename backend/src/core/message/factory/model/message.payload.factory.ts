import { MessageType } from '../../model/message.type';
import { MessagePayload } from '../../model/message.payload.entity';

export class MessagePayloadFactory {

	static createFromObject(value: Partial<MessagePayload>, messageType: MessageType): MessagePayload {
		if (!Object.values(MessageType).includes(messageType)) {
			throw new Error(`Class not found for message type "${messageType}"`);
		}

		const payload = new MessagePayload();

		if (messageType === MessageType.TEXT) {
			payload.text = value.text;
		} else if (messageType === MessageType.CALL) {
			payload.startAt = value.startAt;
			payload.endAt = value.endAt;
		} else if (messageType === MessageType.IMAGE) {
			payload.imageUrl = value.imageUrl;
			payload.text = value.text;
		}

		return payload;
	}

}
