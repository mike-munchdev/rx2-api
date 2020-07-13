const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Drug {
    id: ID!
    brand_name: String
    labeler_name: String
    generic_name: String
  }
`;

module.exports = typeDefs;
