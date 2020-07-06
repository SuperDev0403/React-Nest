import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';

export default registerAs('firebase-admin', (): admin.AppOptions => {
	const config = {
		storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
	};

	// TODO: may be needed later
	// if (!!process.env.FIREBASE_CONFIG) {
	//   for (const key of Object.keys(process.env.FIREBASE_CONFIG)) {
	//     config[key] = process.env.FIREBASE_CONFIG[key];
	//   }
	// }

	return {
		...config,
		credential: admin.credential.applicationDefault(),
	};
});
