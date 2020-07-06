import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { CallGateway } from './call.gateway';
import { CallController } from './call.controller';

@Module({
	imports: [
		CoreModule,
	],
	providers: [
		CallGateway,
	],
	controllers: [
		CallController,
	],
	exports: [],
})
export class CallModule {
}
