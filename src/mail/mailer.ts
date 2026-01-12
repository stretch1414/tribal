import { type User } from '@prisma/client';
import dayjs from '../lib/dayjs.js';
import db from '../lib/db.js';
import logger from '../lib/logger.js';
import resend from '../lib/resend.js';
import { renderScrawlsDigestEmail } from './ScrawlsDigest/ScrawlsDigest.js';

export const sendScrawlDigest = async (input: User, scheduledAt: Date) => {
	// At this point, the scheduledAt value has already accounted for the User's timezone
	const rawEndOfBucket = dayjs(scheduledAt);
	const rawStartOfBucket = rawEndOfBucket.subtract(1, 'day');
	const startOfBucket = rawStartOfBucket.toISOString();
	const endOfBucket = rawEndOfBucket.toISOString();
	const when = rawEndOfBucket.tz(input.timezone).format('MMM D, YYYY');

	const scrawls = await db.scrawl.findMany({
		where: {
			AND: [
				{ userId: input.id },
				{
					createdAt: {
						gte: startOfBucket,
						lte: endOfBucket,
					},
				},
			],
		},
	});

	const { htmlBody, textBody } = await renderScrawlsDigestEmail({
		scrawls,
		when,
	});

	// TODO:
	// Should we replace faktory with the `scheduledAt` value of Resend?
	// Should we include the Job ID as the idempotency key?
	const response = await resend.emails.send({
		to: input.email,
		from: 'daily@scrawlit.com',
		subject: `Scrawl Digest for ${when}`,
		html: htmlBody,
		text: textBody,
	});

	if (response.error) {
		logger.error('Error sending email', response.error);
	}

	await db.user.update({
		where: { id: input.id },
		data: {
			pendingJob: null,
		},
	});

	return {
		messageId: response.data?.id,
		scrawls,
	};
};
