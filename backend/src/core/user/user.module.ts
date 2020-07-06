import { Module, Provider } from '@nestjs/common';
import { CreateUserCommand } from './command/create.user.command';
import { UserEntityRepository } from './repository/user.entity.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { GetUserListQuery } from './query/get.user.list.query';
import { GetUserQuery } from './query/get.user.query';
import { ResetPasswordCommand, ResetPasswordCommandConfig } from './command/reset.password.command';
import { BCryptPasswordEncoder } from '../../lib/security/encoder/bcrypt.password.encoder';
import { UpdatePasswordCommand } from './command/update.password.command';
import { AddUserContactCommand } from './command/add.user.contact.command';
import { DebugModule } from '../debug/debug.module';
import { WsUserRegistry } from './ws/ws.user.registry';
import { UserContact } from './model/user.contact.entity';
import { UserContactEntityRepository } from './repository/user.contact.entity.repository';
import { GetUserContactListQuery } from './query/get.user.contact.list.query';
import { NodemailerModule } from '../nodemailer/nodemailer.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import { CONFIG_TOKEN } from '../../config/auth';
import { plainToClass } from 'class-transformer';
import { UpdateUserCommand } from './command/update.user.command';

const providers: Array<Provider<any>> = [
	BCryptPasswordEncoder,
	UserEntityRepository,
	UserContactEntityRepository,
	GetUserQuery,
	GetUserListQuery,
	GetUserContactListQuery,
	CreateUserCommand,
	UpdateUserCommand,
	{
		provide: ResetPasswordCommandConfig,
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => {
			const config = configService.get(CONFIG_TOKEN);
			return plainToClass(ResetPasswordCommandConfig, {
				resetPasswordUrl: config.resetPasswordUrl,
			});
		},
	},
	ResetPasswordCommand,
	UpdatePasswordCommand,
	AddUserContactCommand,
	WsUserRegistry,
];

@Module({
	imports: [
		TypeOrmModule.forFeature([User, UserContact]),
		DebugModule,
		NodemailerModule,
		ConfigModule,
	],
	providers,
	exports: providers,
})
export class UserModule {
}
