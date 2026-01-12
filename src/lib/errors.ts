import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import logger from './logger.js';

class RequestError extends Error {
	code: number;

	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		this.code = 500;
	}
}

export class BadRequestError extends RequestError {
	constructor(message = 'Bad Request', options?: ErrorOptions) {
		super(message, options);
		this.code = 400;
	}
}

export class AuthenticationError extends RequestError {
	constructor(message = 'Unauthorized', options?: ErrorOptions) {
		super(message, options);
		this.code = 401;
	}
}

export class ForbiddenError extends RequestError {
	constructor(message = 'Forbidden', options?: ErrorOptions) {
		super(message, options);
		this.code = 403;
	}
}

export class NotFoundError extends RequestError {
	constructor(message = 'Not Found', options?: ErrorOptions) {
		super(message, options);
		this.code = 404;
	}
}

export class ConflictError extends RequestError {
	constructor(message = 'Conflict', options?: ErrorOptions) {
		super(message, options);
		this.code = 409;
	}
}

export class InternalServerError extends RequestError {}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	logger.error(err);

	if (res.headersSent) {
		return next(err);
	}

	if (err instanceof RequestError) {
		res.status(err.code).send(err.message);
		return;
	}

	// TODO: Add zod parsing error handler

	if (
		err instanceof Prisma.PrismaClientKnownRequestError &&
		err.code === 'P2025' // Specific code for "record not found"
	) {
		res.status(404).send(err.message);
		return;
	}

	res.status(500).send(`Internal server error: ${err?.message}`);
};
