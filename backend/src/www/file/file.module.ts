import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { FileController } from './file.controller';

@Module({
	imports: [
		CoreModule,
	],
	providers: [],
	controllers: [
		FileController,
	],
	exports: [],
})
export class FileModule {
}
