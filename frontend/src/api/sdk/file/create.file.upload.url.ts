import { url } from '../../routing/url';
import { jsonRequest } from '../../request/request';

export const BREAKING_NEWS_CREATE_IMAGE_UPLOAD_URL = url('/file/upload-url');

export interface CreateImageUploadUrlRequest {
	fileName: string;
	contentType?: string;
}

export interface CreateImageUploadUrlResponse {
	method: 'PUT';
	uploadUrl: string;
	viewUrl: string;
}

export const createFileUploadUrl = async (data: CreateImageUploadUrlRequest): Promise<CreateImageUploadUrlResponse> => {
	const response = await jsonRequest(BREAKING_NEWS_CREATE_IMAGE_UPLOAD_URL, {
		method: 'post',
		body: JSON.stringify(data),
	});

	return response.json();
};
