import { createYoga } from 'graphql-yoga';
import { useGenericAuth } from '@envelop/generic-auth';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { addResolversToSchema } from '@graphql-tools/schema';
import { resolveUserFn } from './auth';
import resolvers from './resolvers';
import schema from './typeDefs';

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

const yoga = createYoga({
	context: {},
	schema: schemaWithResolvers,
	plugins: [
		useGraphQlJit(),
		useGenericAuth({ resolveUserFn, mode: 'protect-all' }),
	],
});

Bun.serve({
	port: 4000,
	async fetch(request) {
		console.log(request.url);
		if (request.url.includes('/graphql')) {
			const response = await yoga.handleRequest(request, {});

			return response;
		}

		return new Response(undefined, {
			status: 400,
			statusText: '404 - REST not supported',
		});
	},
});

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
