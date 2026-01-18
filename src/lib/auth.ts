import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { type User } from '@prisma/client';
import db from './db.js';
import { AuthenticationError } from './errors.js';
import logger from './logger.js';

// TODO - replace with env var, generate on deployed machine,
// or pull from Cloud Storage? Or just replace all of this with Auth0?
const privatePem = readFileSync(`${homedir()}/jwtRSA256-private.pem`);
const privateKey = crypto.createPrivateKey(privatePem);
const publicKey = crypto.createPublicKey(privateKey);

export const generatePassword = async (password: string) => {
	try {
		const passwordHash = await argon2.hash(password, {
			secret: Buffer.from(process.env.AUTH_SECRET!),
		});

		return passwordHash;
	} catch (err) {
		logger.error({ msg: 'Error generating password', err });
	}
};

export const verifyPassword = async (
	passwordHash: string,
	password: string,
) => {
	try {
		const verified = await argon2.verify(passwordHash, password, {
			secret: Buffer.from(process.env.AUTH_SECRET!),
		});

		return verified;
	} catch (err) {
		logger.error({ msg: 'Error verifying password', err });
	}
};

export const generateToken = (user: Omit<User, 'hashedPassword'>) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				id: user.id,
				// email: user.email,
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
		jwt.verify(token, publicKey, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});
};

export const getUserFromToken = async (token: string) => {
	const decodedToken = await verifyToken(token);

	if (!decodedToken || typeof decodedToken === 'string') {
		logger.error({ msg: 'What do we do here?', decodedToken });
		throw new AuthenticationError('Invalid token');
	}

	try {
		const user = await db.user.findUniqueOrThrow({
			where: {
				id: decodedToken.id,
			},
		});

		return user;
	} catch (err) {
		logger.error({ msg: 'Error getting user from token', err });
		throw new AuthenticationError('Invalid token');
	}
};
