import { type User } from '@prisma/client';

declare global {
	namespace Express {
		interface Locals {
			user: Omit<User, 'hashedPassword'>;
		}
	}
}

export {};
