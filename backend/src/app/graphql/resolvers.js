import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';

const typeArray = fileLoader(path.join(__dirname, '**', '*-resolvers.js'));
const resolvers = mergeResolvers(typeArray);

export default resolvers;