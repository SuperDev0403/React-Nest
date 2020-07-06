import * as bcrypt from 'bcrypt';

export class BCryptPasswordEncoder {

	async encode(plainPassword: string): Promise<string> {
		return await bcrypt.hash(plainPassword, 10);
	}

	async isEqual(hash: string, plainPassword: string): Promise<boolean> {
		return await bcrypt.compare(plainPassword, hash);
	}

}
