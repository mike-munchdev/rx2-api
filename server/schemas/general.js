const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type GeneralResponse {
    ok: Boolean!
    message: String
    errors: [Error!]
  }
`;

module.exports = typeDefs;
