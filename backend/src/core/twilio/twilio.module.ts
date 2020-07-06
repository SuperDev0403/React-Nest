import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { CONFIG_TOKEN } from '../../config/twilio';

const providers = [
	{
		provide: Twilio,
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => {
			const config = configService.get(CONFIG_TOKEN);
			return new Twilio(config.accountSid, config.authToken);
		},
	},
];

@Module({
	imports: [ConfigModule],
	providers,
	exports: providers,
})
export class TwilioModule {
}
