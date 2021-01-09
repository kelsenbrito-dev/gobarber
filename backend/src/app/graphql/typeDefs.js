import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';

const allTypeDefs = fileLoader(path.join(__dirname, '**', '*.gql'));
const typeDefs = mergeTypes(allTypeDefs);

export default typeDefs;