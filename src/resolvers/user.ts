import { gql } from 'graphql-tag';
import { Resolvers } from '../types';

export const typeDefs = gql`
	extend type Query {
		user(id: ID!): User
	}
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		isAdmin: Boolean!
	}
`;

const resolvers: Resolvers = {
	Query: {
		user: () => ({
			id: '1',
			firstName: 'test',
			lastName: 'itWorks',
			isAdmin: false,
		}),
	},
};

export default resolvers;
