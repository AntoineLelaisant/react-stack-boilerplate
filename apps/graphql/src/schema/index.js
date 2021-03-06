import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
});

export default new GraphQLSchema({
  query: RootQuery,
});
