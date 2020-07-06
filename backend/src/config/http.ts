import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'http';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		cors: {
			origin: true,
			methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			exposedHeaders: ['Link'],
			credentials: true,
		},
		server: {
			port: process.env.PORT || 8000,
		},
	};
});
