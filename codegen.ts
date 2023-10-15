import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'src/typeDefs/*.graphql',
	generates: {
		'src/types.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
		},
	},
};

export default config;
