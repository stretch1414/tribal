import { RequestHandler, Router } from 'express';
import type Stripe from 'stripe';

import db from '../lib/db.js';
import logger from '../lib/logger.js';
import stripe from '../lib/stripe.js';

const router = Router();

const stripeWebhook: RequestHandler = async (req, res, next) => {
	const payload = req.body;
	const sig = req.headers['stripe-signature'];
	let stripeEvent: Stripe.Event;

	if (!sig) {
		res.status(400).json({ error: 'Stripe Webhook Error: Invalid signature' });
		return;
	}

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			payload,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ error: `Stripe Webhook Error: ${err.message}` });
			return;
		}
		throw err;
	}

	logger.info(`Stripe webhook event: ${stripeEvent.type}`);

	switch (stripeEvent.type) {
		// TODO: I think we don't want create to do anything here, as when a new
		// user goes through the checkout flow, we receive a subscription create
		// and update in the same flow. Those could be received or processed
		// out of order, so we don't want to accidentally overwrite the status.
		// Better to only process update events for that situation. If we offer
		// a free tier in the future, this would likely change.
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.deleted': {
			const customerId = stripeEvent.data.object.customer as string;
			const user = await db.user.findFirst({
				where: { stripeCustomerId: customerId },
			});

			if (!user) {
				logger.error(
					`No user found with stripeCustomerId ${customerId} to update subscription`,
				);
				res.status(400).json({
					error: 'No user found to update subscription',
				});
				return;
			}

			await db.user.update({
				where: { id: user.id },
				data: {
					stripeSubscriptionStatus: stripeEvent.data.object.status,
				},
			});
			break;
		}
		case 'invoice.paid':
			// If we end up offering a free subscription tier, we may need to also
			// handle this event to know who is a paying customer, etc.
			break;
		default:
			logger.debug(`Unhandled Stripe event: ${stripeEvent.type}`);
	}

	res.status(200).json({ data: 'Stripe webhook processed' });
};

router.post('/stripe', stripeWebhook);

export default router;
