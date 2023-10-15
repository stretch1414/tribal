import path from 'node:path';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';

const schema = loadSchemaSync(path.join(import.meta.dir, '*'), {
	loaders: [new GraphQLFileLoader()],
});

export default schema;
