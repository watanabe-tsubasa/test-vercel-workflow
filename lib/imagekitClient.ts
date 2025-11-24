import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

const imagekit =
	publicKey && privateKey && urlEndpoint
		? new ImageKit({
				publicKey,
				privateKey,
				urlEndpoint,
			})
		: null;

export function imageKitConfigured() {
	return Boolean(imagekit);
}

export function placeholderDiaryImage(prompt: string) {
	const label = encodeURIComponent(prompt.slice(0, 32) || "diary");
	return `https://placehold.co/1200x800.png?text=${label}`;
}

export async function uploadDiaryImage(options: {
	file: string;
	fileName: string;
	folder?: string;
}) {
	if (!imagekit) {
		throw new Error("ImageKit is not configured");
	}

	const { file, fileName, folder } = options;
	const upload = await imagekit.upload({
		file,
		fileName,
		folder: folder ?? "/diaries",
		useUniqueFileName: true,
		isPrivateFile: false,
	});

	return { url: upload.url, thumbnailUrl: upload.thumbnailUrl };
}
