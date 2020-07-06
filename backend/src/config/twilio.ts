import { registerAs } from '@nestjs/config';

export const CONFIG_TOKEN = 'twilio';

export default registerAs(CONFIG_TOKEN, () => {
	return {
		accountSid: process.env.TWILIO_ACCOUNT_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN,
	};
});
