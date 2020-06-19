const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type Address {
    id: ID!
    address: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
    isDefault: Boolean
    isDelivery: Boolean
  }

  type PaymentMethods {
    id: ID!
    stripeId: String
    isDefault: Boolean
    isActive: Boolean
  }

  type Refills {
    id: ID!
    filledDate: Date
  }
`;

module.exports = typeDefs;
