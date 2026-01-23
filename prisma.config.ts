import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: path.join('db', 'schema.prisma'),
	migrations: {
		path: path.join('db', 'migrations'),
		seed: 'bun db/seed.ts',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
	// views: {
	//   path: path.join("db", "views"),
	// },
	// typedSql: {
	//   path: path.join("db", "queries"),
	// },
});
