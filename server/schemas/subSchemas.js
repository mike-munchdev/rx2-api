const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type Address {
    id: ID!
    streetInfo: String!
    unitInfo: String
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
    pharmacyId: String!
  }

  type ShoppingCart {
    id: ID!
    rx: Rx!
    quantity: Int
    price: Float
  }

  type CustomerSetting {
    id: ID!
    searchDistance: Int!
  }
`;

module.exports = typeDefs;
