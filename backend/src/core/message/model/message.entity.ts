import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { MessageType } from './message.type';
import { User } from '../../user/model/user.entity';
import { MessagePayload } from './message.payload.entity';

@Entity()
export class Message {

	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@CreateDateColumn({
		type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

	@Column({
		type: 'timestamptz',
		nullable: true,
		select: false,
	})
	deletedAt?: Date;

	@Column({
		enum: MessageType,
	})
	type: MessageType;

	@Column()
	@Index()
	threadId: string;

	@ManyToOne(() => User, {eager: true})
	from: User;
	@Column()
	fromId: string;

	@ManyToOne(() => User, {eager: true})
	to: User;
	@Column()
	toId: string;

	@OneToOne(() => MessagePayload, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	payload: MessagePayload;

	@Column({
		type: 'timestamptz',
		nullable: true,
	})
	seenAt?: Date;

	/**
	 * Creates thread ID that is unique for the conversation of the two specified users
	 */
	static createThreadId(fromId: string, toId: string): string {
		const length = Math.max(fromId.length, toId.length);
		let threadId = '';

		for (let i = 0; i < length; i++) {
			const fromChar = fromId[i];
			const toChar = toId[i];

			if (!fromChar) {
				threadId += toChar;
				continue;
			}
			if (!toChar) {
				threadId += fromChar;
				continue;
			}

			if (fromChar >= toChar) {
				threadId += fromChar + toChar;
			} else {
				threadId += toChar + fromChar;
			}
		}

		return threadId;
	}
}
