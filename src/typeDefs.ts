import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typesArray = await loadFiles('**/*.graphql');

const typeDefs = mergeTypeDefs(typesArray);

export default typeDefs;
