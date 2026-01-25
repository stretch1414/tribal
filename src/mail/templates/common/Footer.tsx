import { Column, Link, Row, Text } from '@react-email/components';
import { APP_NAME, Color, COMPANY_ADDRESS, WEBSITE_URL } from '../../lib.js';

export default function Footer() {
	return (
		<Row>
			<Column align="center">
				<Text style={footerText}>
					{APP_NAME} |{' '}
					<Link style={websiteLink} href={`https://${WEBSITE_URL}`}>
						{WEBSITE_URL}
					</Link>
				</Text>
				<Text style={footerText}>{COMPANY_ADDRESS}</Text>
			</Column>
		</Row>
	);
}

const footerText: React.CSSProperties = {
	fontSize: '12px',
	lineHeight: '24px',
	color: Color.JET,
};

const websiteLink: React.CSSProperties = {
	color: 'inherit',
};
