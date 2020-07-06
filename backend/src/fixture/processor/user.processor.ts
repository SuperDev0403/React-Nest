import { IProcessor } from 'typeorm-fixtures-cli/dist';
import { User } from '../../core/user/model/user.entity';
import { BCryptPasswordEncoder } from '../../lib/security/encoder/bcrypt.password.encoder';

export default class UserProcessor implements IProcessor<User> {

	passwordEncoder: BCryptPasswordEncoder;

	constructor() {
		this.passwordEncoder = new BCryptPasswordEncoder();
	}

	async postProcess(name: string, object: User): Promise<void> {
		object.password = await this.passwordEncoder.encode(object.password);
	}

	preProcess(name: string, object: any): any {
		return object;
	}

}
