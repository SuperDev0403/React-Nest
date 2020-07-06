import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'debug';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		prefix: process.env.DEBUG_PREFIX || 'app',
	};
});
