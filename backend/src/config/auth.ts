import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'auth';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		resetPasswordUrl: process.env.AUTH_RESET_PASSWORD_URL || 'http://localhost:3000/auth/update-password/:token',
	};
});
