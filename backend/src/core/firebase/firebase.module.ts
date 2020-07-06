import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';

const providers = [
	{
		provide: 'FIREBASE_ADMIN',
		inject: [ConfigService],
		useFactory: (configService: ConfigService): admin.app.App => {
			const appOptions = configService.get<admin.AppOptions>('firebase-admin');
			return admin.initializeApp(appOptions);
		},
	},
];

@Module({
	imports: [
		ConfigModule,
	],
	providers,
	exports: providers,
})
export class FirebaseModule {
}
