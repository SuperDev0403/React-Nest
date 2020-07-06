import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CoreModule } from '../../core/core.module';
import { UserGateway } from './user.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		CoreModule,
		AuthModule,
	],
	providers: [
		UserGateway,
	],
	controllers: [
		UserController,
	],
	exports: [],
})
export class UserModule {
}
