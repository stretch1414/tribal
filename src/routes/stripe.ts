import { RequestHandler, Router } from 'express';
import z from 'zod';

import stripe from '../lib/stripe.js';
import { NotFoundError } from '../lib/errors.js';

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;
const YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID;

const router = Router();

const createSession: RequestHandler = async (req, res, next) => {
	const user = res.locals.user;

	// TODO: Do we want to have subscriptions always billed on the first of
	// the month and prorate the current month?
	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		line_items: [
			{
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: MONTHLY_PRICE_ID,
				quantity: 1,
			},
		],
		mode: 'subscription',
		return_url: `${process.env.WEB_URL}/post-checkout?session_id={CHECKOUT_SESSION_ID}`,
		customer: user.stripeCustomerId,
		allow_promotion_codes: true,
	});

	res.status(200).json({ secret: session.client_secret });
};

const manageSession: RequestHandler = async (req, res, next) => {
	const user = res.locals.user;

	if (user.stripeSubscriptionStatus !== 'active') {
		throw new NotFoundError();
	}

	const session = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: `${process.env.WEB_URL}/settings`,
	});

	res.status(200).json({ url: session.url });
};

const getSession: RequestHandler = async (req, res, next) => {
	const { id } = z
		.object({
			id: z.string(),
		})
		.parse(req.params);

	// TODO: Do we need to ensure that we don't leak sessions to other users?
	// Since these are checkout sessions, it may not matter. That would only
	// mean that someone could pay for someone else I think?
	// We could store the latest session on the user record
	// in the database or something.
	const session = await stripe.checkout.sessions.retrieve(id);

	if (!session) {
		throw new NotFoundError('Session not found');
	}

	res.status(200).json({
		status: session.status,
		email: session.customer_details?.email,
	});
};

router.post('/session', createSession);
router.put('/session', manageSession);
router.get('/session/:id', getSession);

export default router;
