import path from 'node:path';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

const typeDefsArray = await loadFiles(path.join(import.meta.dir, '*'), {
	ignoreIndex: true,
	recursive: true,
	exportNames: ['typeDefs'],
});

const resolversArray = await loadFiles(path.join(import.meta.dir, '*'), {
	ignoreIndex: true,
	recursive: true,
});

export const typeDefs = mergeTypeDefs(typeDefsArray);
export const resolvers = mergeResolvers(resolversArray);

export default resolvers;
