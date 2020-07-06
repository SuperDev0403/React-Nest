import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class MessagePayload {

	@PrimaryGeneratedColumn('uuid')
	id?: string;

	/*
	 * TEXT MESSAGE
	 */
	@Column({nullable: true})
	text?: string;

	/*
	 * CALL MESSAGE
	 */
	@Column({
		type: 'timestamptz',
		nullable: true,
	})
	startAt?: Date;

	@Column({
		type: 'timestamptz',
		nullable: true,
	})
	endAt?: Date;

	/*
	 * IMAGE MESSAGE
	 */
	@Column({nullable: true, type: 'text'})
	imageUrl?: string;

}
