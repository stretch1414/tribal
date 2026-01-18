import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const db = new PrismaClient({
	adapter,
	omit: {
		user: {
			hashedPassword: true,
		},
	},
});

export * from '../generated/prisma/client.js';
export default db;
