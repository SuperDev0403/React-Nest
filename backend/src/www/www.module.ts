import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from '../core/core.module';
import { UserModule } from './user/user.module';
import { CallModule } from './call/call.module';
import { MessageModule } from './message/message.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [
		CoreModule,
		AuthModule,
		UserModule,
		CallModule,
		MessageModule,
		FileModule,
	],
})
export class WwwModule {
}
