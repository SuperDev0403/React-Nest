import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateFileUploadUrlCommand } from '../../core/file/command/create.file.upload.url.command';

@Controller('file')
export class FileController {

	constructor(
		private readonly createFileUploadUrlCommand: CreateFileUploadUrlCommand,
	) {
	}

	@Post('upload-url')
	@HttpCode(200)
	public async createImageUploadUrl(
		@Body() data: { fileName: string },
	) {
		return this.createFileUploadUrlCommand.execute(data);
	}

}
