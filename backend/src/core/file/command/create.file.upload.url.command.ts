import { Inject, Injectable } from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';
import * as admin from 'firebase-admin';

export interface CreateFileUploadUrlCommandResult {
	method: 'PUT';
	uploadUrl: string;
	viewUrl: string;
}

@Injectable()
export class CreateFileUploadUrlCommand {

	constructor(
		@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
	) {
	}

	public async execute(data: { fileName: string }): Promise<CreateFileUploadUrlCommandResult> {
		const bucket: Bucket = this.firebaseApp.storage().bucket();
		const file = bucket.file(data.fileName);

		const [uploadUrl] = await file.getSignedUrl({
			action: 'write',
			version: 'v4',
			expires: Date.now() + 5 * 60 * 1000,
		});

		// TODO: find a better way to get view url for the image
		const bucketName = bucket.name;
		const objectName = file.name;
		const viewUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;

		return {
			method: 'PUT',
			uploadUrl,
			viewUrl,
		};
	}

}
