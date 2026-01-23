import type { Prisma } from '../src/generated/prisma/client.js';

export default async () => {
	try {
		console.log('Running Prisma seed');
	} catch (error) {
		console.error(error);
	}
};
