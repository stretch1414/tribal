import { Resolvers } from '../../types';

const resolvers: Resolvers = {
	Query: {
		user: () => {
			return {
				id: '1',
				email: 'test@example.com',
				firstName: 'test',
				lastName: 'itWorks',
				isAdmin: false,
			};
		},
	},
};

export default resolvers;
