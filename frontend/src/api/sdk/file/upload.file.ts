import { createFileUploadUrl } from './create.file.upload.url';
import { request } from '../../../lib/http/request';

export interface UploadFileRequest {
	file: File;
}

export interface UploadFileResponse {
	fileUrl: string;
}

export const uploadFile = async (data: UploadFileRequest): Promise<UploadFileResponse> => {
	const uploadUrlResponse = await createFileUploadUrl({
		fileName: data.file.name,
		contentType: data.file.type,
	});

	await request(uploadUrlResponse.uploadUrl, {
		method: uploadUrlResponse.method,
		body: data.file,
		credentials: 'omit',
	});

	return {
		fileUrl: uploadUrlResponse.viewUrl,
	};
};
