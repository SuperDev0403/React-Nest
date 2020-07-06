import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class UserContact {

	@PrimaryGeneratedColumn('uuid')
	@Expose()
	id?: string;

	@ManyToOne(() => User)
	@JoinColumn()
	user1?: User;
	@Column()
	user1Id: string;

	@ManyToOne(() => User)
	@JoinColumn()
	user2?: User;
	@Column()
	user2Id: string;

}
