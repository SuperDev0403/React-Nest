export const readAsDataURL = (file: File): Promise<string> => {
	return new Promise(resolve => {
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			resolve(reader.result as string);
		}, false);

		reader.readAsDataURL(file);
	});
};

export const readAsImage = async (file: File): Promise<HTMLImageElement> => {
	const dataUrl = await readAsDataURL(file);

	return new Promise(resolve => {
		const image = new Image();

		image.addEventListener('load', () => {
			resolve(image);
		}, false);

		image.src = dataUrl;
	});
};

export const readUrlAsImage = (fileUrl: string): Promise<HTMLImageElement> => {
	const image = new Image();

	return new Promise(resolve => {
		image.addEventListener('load', () => resolve(image));
		image.crossOrigin = 'Anonymous';
		image.src = fileUrl;
	});
};
