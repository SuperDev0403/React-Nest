import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from './type-orm/type.orm.module';
import { ConfigModule } from './config/config.module';
import { TwilioModule } from './twilio/twilio.module';
import { DebugModule } from './debug/debug.module';
import { MessageModule } from './message/message.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { FileModule } from './file/file.module';

const modules = [
	ConfigModule,
	TypeOrmModule,
	DebugModule,
	TwilioModule,
	NodemailerModule,
	UserModule,
	MessageModule,
	FileModule,
];

@Module({
	imports: modules,
	exports: modules,
})
export class CoreModule {
}
