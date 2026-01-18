import 'dotenv/config';

import http from 'http';
import closeWithGrace from 'close-with-grace';

import app from './src/index.js';
import db from './src/lib/db.js';
import logger from './src/lib/logger.js';

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

closeWithGrace(
	{
		delay: 10000,
		logger,
	},
	async function ({ signal, err, manual }) {
		if (err) {
			logger.error(err);
		}
		logger.info({
			msg: `${signal} signal received: initiating shutdown sequence`,
		});
		logger.info({ msg: 'Draining Postgres connection pool' });
		await db.$disconnect();
		logger.info({ msg: 'Postgres connection pool drained' });
		logger.info({ msg: 'Closing HTTP server' });
		server.close(() => {
			console.log('HTTP server closed');
		});
	},
);

function onListening() {
	const addr = server.address();
	if (!addr) {
		logger.info({ msg: `Listening on default port: ${port}` });
		return;
	}
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	logger.info({ msg: 'Listening on ' + bind });
}

server.on('listening', onListening);
