const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TokenResponse {
    ok: Boolean!
    token: String
    error: Error
  }

  type Query {
    getCustomerTokenByEmailAndPassword(
      email: String!
      password: String!
    ): TokenResponse
  }
`;

module.exports = typeDefs;
