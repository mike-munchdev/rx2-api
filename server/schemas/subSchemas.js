const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Address {
    id: ID!
    address: String
    address2: String
    city: String
    state: String
    isDefault: Boolean
    isDelivery: Boolean
  }

  type PaymentMethods {
    id: ID!
    stripeId: String
    isDefault: Boolean
    isActive: Boolean
  }
`;

module.exports = typeDefs;
