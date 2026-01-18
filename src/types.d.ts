import { type User } from './lib/db.js';

declare global {
	namespace Express {
		interface Locals {
			user: Omit<User, 'hashedPassword'>;
		}
	}
}

export {};
