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
	Section,
	Text,
} from '@react-email/components';
import { render, toPlainText } from '@react-email/render';
import { Scrawl } from '@prisma/client';
import { Color } from './colors.js';

export type ScrawlsDigestEmailProps = {
	scrawls: Scrawl[];
	when: string;
};

export async function renderScrawlsDigestEmail(props: ScrawlsDigestEmailProps) {
	const htmlBody = await render(<ScrawlsDigestEmail {...props} />);
	return {
		htmlBody,
		textBody: toPlainText(htmlBody),
	};
}

export function ScrawlsDigestEmail(
	{ scrawls, when }: ScrawlsDigestEmailProps = {
		scrawls: [],
		when: new Date().toLocaleString(),
	},
) {
	return (
		<Html lang="en">
			<Head />
			<Preview>{scrawls.length.toString()} scrawls to review</Preview>
			<Body style={body}>
				<Container style={container}>
					{/* Will need to have the logo hosted in cloud storage somewhere */}
					<Img
						src={`${process.env.WEB_URL}/logo.png`}
						alt="scrawl it logo"
						width={206}
						height={89}
						style={logo}
					/>
					<Heading style={heading}>Daily Scrawls for {when}</Heading>
					<Container>
						{scrawls.map((scrawl) => (
							<Section key={scrawl.id} style={scrawlContainer}>
								<Row style={{ height: '40px', padding: '4px' }}>
									<Column style={{ width: '40px' }}>
										<Heading style={scrawlTypeHeading}>
											{scrawl.shortcut.toUpperCase()}
										</Heading>
									</Column>
									<Column>
										<Text style={scrawlTitle}>
											{/*
                        TODO - Need a more robust way of truncating the text. Though
                        since we have a hard set width for the emails, this might
                        just be good enough.
                      */}
											{scrawl.note.length > 35
												? `${scrawl.note.substring(0, 32)}...`
												: scrawl.note}
										</Text>
									</Column>
								</Row>
								<Row>
									<Column style={{ padding: '0px 16px' }}>
										<Text style={scrawlBody}>
											{getShortcutLink(scrawl.shortcut, scrawl.note)}
										</Text>
									</Column>
								</Row>
							</Section>
						))}
						<Row style={{ marginTop: '26px' }}>
							<Column align="center">
								<Link style={viewInApp} href={`${process.env.WEB_URL}/scrawls`}>
									View in app
								</Link>
							</Column>
						</Row>
					</Container>
					<Hr style={hr} />
					<Row>
						<Column align="center">
							<Text style={footerText}>
								Scrawl It |{' '}
								<Link style={websiteLink} href="https://www.scrawlit.com">
									www.scrawlit.com
								</Link>
							</Text>
							<Text style={footerText}>
								1258 Riverbank Dr, Westfield, IN 46074
							</Text>
						</Column>
					</Row>
				</Container>
			</Body>
		</Html>
	);
}

// TODO - These hard-coded strings need to be embedded directly into
// the scrawl data passed into the email to support custom links in the future
const getShortcutLink = (shortcut: string, value: string) => {
	const encodedValue = encodeURIComponent(value);

	if (shortcut === 'a') {
		return (
			<Link
				style={scrawlLink}
				href={`https://www.amazon.com/s?k=${encodedValue}`}
			>
				Search Amazon for &quot;{value}&quot;
			</Link>
		);
	}

	if (shortcut === 'g') {
		return (
			<Link
				style={scrawlLink}
				href={`https://www.google.com/search?q=${encodedValue}`}
			>
				Search Google for &quot;{value}&quot;
			</Link>
		);
	}

	if (shortcut === 'yt') {
		return (
			<Link
				style={scrawlLink}
				href={`https://www.youtube.com/results?search_query=${encodedValue}`}
			>
				Search YouTube for &quot;{value}&quot;
			</Link>
		);
	}

	return value;
};

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

const scrawlContainer: React.CSSProperties = {
	margin: '8px 0',
	borderRadius: '10px',
	backgroundColor: Color.JET,
};

const scrawlTypeHeading: React.CSSProperties = {
	width: '40px',
	height: '40px',
	margin: '0px',
	borderRadius: '10px',
	textAlign: 'center',
	fontSize: '24px',
	fontWeight: 400,
	lineHeight: '40px',
	color: Color.WHITE,
	backgroundColor: Color.FIERY_ORANGE,
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

const scrawlTitle: React.CSSProperties = {
	fontSize: '20px',
	fontWeight: 500,
	lineHeight: '24px',
	margin: '0px',
	marginLeft: '8px',
	color: Color.WHITE,
};

const scrawlBody: React.CSSProperties = {
	fontSize: '14px',
	lineHeight: '24px',
	color: Color.WHITE,
	whiteSpace: 'pre-line',
};

const hr: React.CSSProperties = {
	margin: '26px 0px',
	width: '100%',
	border: `1px solid ${Color.JET}`,
};

const footerText: React.CSSProperties = {
	fontSize: '12px',
	lineHeight: '24px',
	color: Color.JET,
};

const scrawlLink: React.CSSProperties = {
	color: Color.SIROCCO,
};

const websiteLink: React.CSSProperties = {
	color: 'inherit',
};

const viewInApp: React.CSSProperties = {
	fontSize: '16px',
	textDecoration: 'none',
	padding: '10px 0px',
	width: '220px',
	display: 'block',
	textAlign: 'center',
	fontWeight: 500,
	border: `1px solid ${Color.FIERY_ORANGE}`,
	color: Color.FIERY_ORANGE,
};
