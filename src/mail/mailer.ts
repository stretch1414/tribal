import logger from '../lib/logger.js';
import resend from '../lib/resend.js';
import { FROM_EMAIL } from './lib.js';
import {
	renderPasswordResetEmail,
	renderVerifyEmailEmail,
} from './templates/index.js';

export async function sendPasswordReset(input: {
	email: string;
	code: string;
}) {
	const { htmlBody, textBody } = await renderPasswordResetEmail({
		code: input.code,
	});

	const response = await resend.emails.send({
		to: input.email,
		from: FROM_EMAIL,
		subject: 'Reset Password',
		html: htmlBody,
		text: textBody,
	});

	if (response.error) {
		logger.error({ msg: 'Error sending email', error: response.error });
	}
}

export async function sendVerifyEmail(input: { email: string; code: string }) {
	const { htmlBody, textBody } = await renderVerifyEmailEmail({
		code: input.code,
	});

	const response = await resend.emails.send({
		to: input.email,
		from: FROM_EMAIL,
		subject: 'Reset Password',
		html: htmlBody,
		text: textBody,
	});

	if (response.error) {
		logger.error({ msg: 'Error sending email', error: response.error });
	}
}
