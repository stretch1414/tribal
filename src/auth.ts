import crypto from 'crypto';
import { readFileSync } from 'fs';
import { password as argon2 } from 'bun';
import jwt from 'jsonwebtoken';
import { YogaInitialContext } from 'graphql-yoga';
import { User } from './types';

// TODO - replace with env var, generate on deployed machine,
// or pull from Cloud Storage? Or just replace all of this with Auth0?
const privatePem = readFileSync('./jwtRSA256-private.pem');
const privateKey = crypto.createPrivateKey(privatePem);

export const databaseByEmailSingleton: Record<string, User> = {
	// 'test@example.com': {},
};

export const generatePassword = async (password: string) => {
	try {
		const passwordHash = await argon2.hash(password);

		return passwordHash;
	} catch (err) {
		console.error('Error generating password', err);
	}
};

export const verifyPassword = async (
	passwordHash: string,
	password: string,
) => {
	try {
		const verified = await argon2.verify(password, passwordHash);

		return verified;
	} catch (err) {
		console.error('Error verifying password', err);
	}
};

export const generateToken = (user: User) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			privateKey,
			{ expiresIn: '6h', algorithm: 'RS256' },
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			},
		);
	});
};

export const verifyToken = (
	token: string,
): Promise<string | jwt.JwtPayload | undefined> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, privateKey, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});
};

export const tradeTokenForUser = async (token: string) => {
	const decodedToken = await verifyToken(token);

	if (typeof decodedToken === 'string') {
		console.log(decodedToken);
		console.log('What do we do here?');
		throw new Error('Uhh');
	}

	try {
		// TODO - Replace with actual database call
		const user = databaseByEmailSingleton[decodedToken?.email];

		return user;
	} catch (err) {
		console.error('Error trading token for user', err);
	}
};

export const resolveUserFn = async (context: YogaInitialContext) => {
	const token = context.request.headers.get('authorization');

	if (!token) {
		return null;
	}

	try {
		const user = await tradeTokenForUser(token);

		return user;
	} catch (err) {
		console.error('Failed to validate token', err);

		return null;
	}
};

export const validateUser = async (user: User) => {
	if (!user) {
		throw new Error('Unauthenticated');
	}
};
