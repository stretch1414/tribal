import { YogaInitialContext } from 'graphql-yoga';

const context = (initialContext: YogaInitialContext) => {
	// const { request } = initialContext;
	// let authToken = null;
	// let currentUser = null;

	// try {
	// 	authToken = request.headers.get(HEADER_NAME);

	// 	if (authToken) {
	// 		currentUser = await tradeTokenForUser(authToken);
	// 	}
	// } catch (e) {
	// 	console.warn(`Unable to authenticate using auth token: ${authToken}`);
	// }

	return {
		// authToken,
		// currentUser,
	};
};

export default context;
