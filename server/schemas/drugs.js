const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Drug {
    id: ID!
    brandName: String
    labelerName: String
    genericName: String
  }
`;

module.exports = typeDefs;
