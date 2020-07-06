import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';

import { createTransport } from 'nodemailer';
import { CONFIG_TOKEN } from '../../config/nodemailer';

const providers = [
	{
		provide: 'mailer',
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => {
			const config = configService.get(CONFIG_TOKEN);
			return createTransport(config);
		},
	},
];

@Module({
	imports: [ConfigModule],
	providers,
	exports: providers,
})
export class NodemailerModule {
}
