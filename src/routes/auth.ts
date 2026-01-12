import { RequestHandler, Router } from 'express';
import z from 'zod';
import {
	generatePassword,
	generateToken,
	verifyPassword,
} from '../lib/auth.js';
import db from '../lib/db.js';
import {
	AuthenticationError,
	ConflictError,
	InternalServerError,
	NotFoundError,
} from '../lib/errors.js';
import logger from '../lib/logger.js';
import stripe from '../lib/stripe.js';

const router = Router();

const signup: RequestHandler = async (req, res, next) => {
	const { email, password } = z
		.object({
			email: z.email(),
			password: z.string(),
		})
		.parse(req.body);

	// TODO: Signup needs to include the following workflow
	// - User signs up with an email address and password
	// - We send an email to them to verify their email
	// - They get logged in and sent through onboarding
	// - Where does Stripe fit into this? Should that be
	// how the user gets created? We need a stripe customer
	// to create the DB record (I think).
	// - Password requirements
	// - Gather more information about our users in onboarding?

	const user = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (user) {
		// TODO: Need a way of handling the invalid email case so
		// the user knows whether or not they have an account.
		throw new ConflictError();
	}

	const hashedPassword = await generatePassword(password);

	if (!hashedPassword) {
		logger.error('Error hashing password for signup', { email });
		throw new InternalServerError();
	}

	// TODO: Not sure this is right. I think we need to be updating
	// the user record with this information. Probably have them signup,
	// then go to Stripe Checkout, then we update the user once we
	// receive the webhook, and then send user through onboarding. Though
	// we could still create the customer here, use that for the checkout
	// portal and then just check the subscription status.
	const customer = await stripe.customers.create({
		email,
	});

	const newUser = await db.user.create({
		data: {
			email: email.toLowerCase().trim(),
			hashedPassword,
			stripeCustomerId: customer.id,
		},
	});

	const token = await generateToken(newUser);

	res.status(200).json({ token });
};

const login: RequestHandler = async (req, res, next) => {
	const { email, password } = z
		.object({
			email: z.email(),
			password: z.string(),
		})
		.parse(req.body);

	const user = await db.user.findUnique({
		where: {
			email,
		},
		omit: {
			hashedPassword: false,
		},
	});

	if (!user) {
		// TODO: Need a way of handling the invalid email case so
		// the user knows whether or not they have an account.
		throw new AuthenticationError();
	}

	const isValid = await verifyPassword(user.hashedPassword, password);

	if (!isValid) {
		throw new AuthenticationError();
	}

	const token = await generateToken(user);

	res.status(200).json({ token });
};

router.post('/signup', signup);
router.post('/login', login);

export default router;
