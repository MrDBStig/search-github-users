import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const GITHUB_GRAPHQL_API_LINK = "https://api.github.com/graphql";

const authLink = new SetContextLink(({ headers }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) throw new Error("VITE_GITHUB_TOKEN is missing");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: GITHUB_GRAPHQL_API_LINK,
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
