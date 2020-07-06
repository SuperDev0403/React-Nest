import * as sharp from 'sharp';

export interface ResizeOptions {
	width: number;
	height: number;
}

export const resizeImageDataUrl = (imageDataUrl: string, options: ResizeOptions) => {
	const imageBase64 = imageDataUrl.split(';base64,').pop();
	const contentType = imageDataUrl.match(/data:([^;]+);/)?.[1];
	const imageBuffer = Buffer.from(imageBase64, 'base64');

	return resize(imageBuffer, options)
		.then(resizedImageBuffer => {
			const resizedImageBase64 = resizedImageBuffer.toString('base64');
			return `data:${contentType};base64,${resizedImageBase64}`;
		});
};

export const resize = (imageBuffer: Buffer, options: ResizeOptions) => {
	return sharp(imageBuffer)
		.rotate()
		.resize(options)
		.toBuffer();
};
