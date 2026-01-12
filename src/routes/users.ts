import { RequestHandler, Router } from 'express';
import z from 'zod';
import db from '../lib/db.js';
import stripe from '../lib/stripe.js';
import { subscriptionHandler } from '../lib/middleware.js';

const router = Router();

const me: RequestHandler = (req, res, next) => {
	res.status(200).json(res.locals.user);
};

const updateUser: RequestHandler = async (req, res, next) => {
	const user = res.locals.user;
	const body = z
		.object({
			notificationTime: z.string().optional(),
			timezone: z.string().optional(),
			isOnboarded: z.boolean().optional(),
		})
		.parse(req.body);

	const updatedUser = await db.user.update({
		where: { id: user.id },
		data: body,
	});

	res.status(200).json(updatedUser);
};

const deleteUser: RequestHandler = async (req, res, next) => {
	const user = res.locals.user;

	// TODO: Do we want to soft delete the user and just cancel the
	// subscription instead? Or maybe we only use this whenever a user
	// specifically chooses to delete their account. We could have a
	// separate flow for just cancelling their subscription. If we do
	// keep hard delete, we should allow them to export their scrawls.
	await db.user.delete({
		where: { id: user.id },
	});

	await stripe.customers.del(user.stripeCustomerId);

	res.status(200).json({ msg: 'User deleted successfully' });
};

router.get('/me', me);
router.patch('/me', subscriptionHandler, updateUser);
router.delete('/me', deleteUser);

export default router;
