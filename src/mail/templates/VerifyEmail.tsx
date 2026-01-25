import React from 'react';
import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Text,
} from '@react-email/components';
import { render, toPlainText } from '@react-email/render';
import { Color } from '../lib.js';
import Footer from './common/Footer.jsx';

export type VerifyEmailEmailProps = {
	code: string;
};

export async function renderVerifyEmailEmail(props: VerifyEmailEmailProps) {
	const htmlBody = await render(<VerifyEmailEmail {...props} />);
	return {
		htmlBody,
		textBody: toPlainText(htmlBody),
	};
}

export function VerifyEmailEmail({ code }: VerifyEmailEmailProps) {
	return (
		<Html lang="en">
			<Head />
			<Preview>Verify Email</Preview>
			<Body style={body}>
				<Container style={container}>
					{/* Will need to have the logo hosted in cloud storage somewhere */}
					<Img
						src={`${process.env.WEB_URL}/logo.png`}
						alt="logo"
						width={206}
						height={89}
						style={logo}
					/>
					<Heading style={heading}>Verify your email</Heading>
					<Container>
						<Text>Click the link below to reset your password.</Text>
						<Link>Reset</Link>
					</Container>
					<Hr style={hr} />
					<Footer />
				</Container>
			</Body>
		</Html>
	);
}

const body: React.CSSProperties = {
	backgroundColor: Color.BLACK,
	margin: 'auto',
	fontFamily:
		'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const container: React.CSSProperties = {
	maxWidth: '600px',
	margin: '40px auto',
	padding: '20px',
	border: `1px solid ${Color.JET}`,
	borderRadius: '4px',
};

const logo: React.CSSProperties = {
	margin: 'auto',
};

const heading: React.CSSProperties = {
	margin: '30px 0px',
	padding: '0px',
	textAlign: 'center',
	fontSize: '24px',
	fontWeight: 400,
	lineHeight: '32px',
	color: Color.WHITE,
};

const hr: React.CSSProperties = {
	margin: '26px 0px',
	width: '100%',
	border: `1px solid ${Color.JET}`,
};
