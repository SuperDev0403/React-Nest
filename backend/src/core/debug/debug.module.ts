import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import { CONFIG_TOKEN } from '../../config/debug';
import * as debug from 'debug';
import { Debugger } from 'debug';

const providers = [
	{
		provide: 'debug',
		inject: [ConfigService],
		useFactory: (configService: ConfigService): Debugger => {
			const config = configService.get(CONFIG_TOKEN);
			return debug(config.prefix);
		},
	},
];

@Module({
	imports: [ConfigModule],
	providers,
	exports: providers,
})
export class DebugModule {
}
