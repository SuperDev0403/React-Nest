import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'security';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		jwt: {
			secret: process.env.AUTH_JWT_SECRET || 'test',
		},
	};
});
