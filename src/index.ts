import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';

import { errorHandler } from './lib/errors.js';
import logger from './lib/logger.js';
import { authHandler, subscriptionHandler } from './lib/middleware.js';

import authRouter from './routes/auth.js';
import stripeRouter from './routes/stripe.js';
import usersRouter from './routes/users.js';
import webhooksRouter from './routes/webhooks.js';

const app = express();

app.use(
	pinoHttp({
		autoLogging: {
			ignore(req) {
				// The health-check logs get spammy in production
				if (req.path === '/healthz') {
					return true;
				}
				return false;
			},
		},
	}),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/healthz', (req, res) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now(),
	};
	try {
		res.status(200).json(healthcheck);
	} catch (err) {
		if (err instanceof Error) {
			healthcheck.message = `${err.name}: ${err.message}`;
		} else {
			logger.error(err, 'Unknown healthcheck error');
			healthcheck.message = 'Unknown healthcheck error';
		}
		res.status(503).json(healthcheck);
	}
});
app.use('/auth', authRouter);
app.use('/webhooks', webhooksRouter);
app.use('/stripe', authHandler, subscriptionHandler, stripeRouter);
// We don't want the subscriptionHandler on the /me endpoint,
// as there will be an issue with the signup and checkout
// flow since we create the user before the subscription status
// is "active".
app.use('/users', authHandler, usersRouter);
app.use(errorHandler);

export default app;
