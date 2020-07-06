import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'nodemailer';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	};
});
