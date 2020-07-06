import { Module } from '@nestjs/common';
import { CreateFileUploadUrlCommand } from './command/create.file.upload.url.command';
import { FirebaseModule } from '../firebase/firebase.module';

const providers = [
	CreateFileUploadUrlCommand,
];

@Module({
	imports: [
		FirebaseModule,
	],
	providers,
	exports: providers,
})
export class FileModule {
}
