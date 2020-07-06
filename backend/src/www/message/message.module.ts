import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';

@Module({
	imports: [
		CoreModule,
	],
	providers: [
		MessageGateway,
	],
	controllers: [
		MessageController,
	],
	exports: [],
})
export class MessageModule {
}
