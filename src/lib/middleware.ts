import { RequestHandler } from 'express';
import { getUserFromToken } from './auth.js';
import { AuthenticationError, ForbiddenError } from './errors.js';

export const authHandler: RequestHandler = async (req, res, next) => {
	if (!req.headers.authorization) {
		return next(new AuthenticationError('Missing header'));
	}

	const [authType, token] = req.headers.authorization.split(' ');

	if (authType !== 'Bearer') {
		return next(new AuthenticationError('Invalid header'));
	}

	if (!token) {
		return next(new AuthenticationError('Missing token'));
	}

	try {
		const user = await getUserFromToken(token);
		res.locals.user = user;
	} catch (err) {
		return next(err);
	}

	return next();
};

export const subscriptionHandler: RequestHandler = async (req, res, next) => {
	const user = res.locals.user;

	if (user.stripeSubscriptionStatus !== 'active') {
		return next(new ForbiddenError('You must have an active subscription'));
	}

	// TODO: Should we fetch the customer and subscription records
	// from Stripe just to verify the status field in the DB isn't
	// stale?

	return next();
};
