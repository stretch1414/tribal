type Blah = {
	yay: string;
	is: boolean;
};

const resolvers = {
	Query: { user: () => ({ id: 1, fullName: 'test', isAdmin: false }) },
};

export default resolvers;
