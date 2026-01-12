import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
	omit: {
		user: {
			hashedPassword: true,
		},
	},
});

export default db;
