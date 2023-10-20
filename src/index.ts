import { GraphQLSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { useGenericAuth } from '@envelop/generic-auth';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { mergeResolvers } from '@graphql-tools/merge';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';
import { resolveUserFn } from './auth';
import tribalSchema from './typeDefs';
import tribalResolvers from './resolvers';

const tribalContext = {
	tribal: 'test',
};

interface TribalOptions {
	schema: GraphQLSchema;
	resolvers: IResolvers;
	context: Record<string, unknown>;
}

export const createTribal = ({ schema, resolvers, context }: TribalOptions) => {
	const mergedSchema = mergeSchemas({ schemas: [tribalSchema, schema] });
	const mergedResolvers = mergeResolvers([tribalResolvers, resolvers]);
	const mergedContext = { ...tribalContext, ...context };

	const schemaWithResolvers = addResolversToSchema({
		schema: mergedSchema,
		resolvers: mergedResolvers,
	});

	const yoga = createYoga({
		context: mergedContext,
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
};
