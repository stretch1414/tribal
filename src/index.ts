import { createSchema, createYoga, useLogger } from "graphql-yoga";
import { useGraphQlJit } from "@envelop/graphql-jit";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers/index";

const yoga = createYoga({
  context: {},
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  plugins: [useGraphQlJit()],
});

Bun.serve({
  port: 4000,
  fetch: async (request, server) => {
    console.log(request.url);
    if (request.url.includes("/graphql")) {
      const response = await yoga.handleRequest(request, {});

      return response;
    }

    return new Response(undefined, {
      status: 400,
      statusText: "404 - REST not supported",
    });
  },
});

console.log("Running a GraphQL API server at http://localhost:4000/graphql");
