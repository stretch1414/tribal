import path from 'node:path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';

// We want to include files in all sub-directories, but not those
// in this filder (specifically, this file)
const resolversArray = loadFilesSync([
	path.join(import.meta.dir, '**/*'),
	path.join('!', import.meta.dir, '/*'),
]);

console.log(resolversArray);

const resolvers = mergeResolvers(resolversArray);

console.log(resolvers);

export default resolvers;
