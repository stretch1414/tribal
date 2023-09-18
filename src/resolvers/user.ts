const resolvers = {
  Query: { user: () => ({ id: 1, fullName: "test", isAdmin: false }) },
};

export default resolvers;
