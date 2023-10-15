import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'src/resolvers/*.ts',
	generates: {
		'src/types.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
		},
	},
};

export default config;
