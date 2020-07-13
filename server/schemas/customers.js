const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Customer {
    id: ID!
    email: String
    firstName: String!
    middleName: String
    lastName: String!
    suffix: String
    phoneNumber: String
    addresses: [Address!]
    paymentMethods: [PaymentMethods!]
    cart: [ShoppingCart!]
    stripeId: String
    googleId: String
    facebookId: String
    isActive: Boolean
    confirmToken: String
    thumbnailUri: String
    createdAt: Date!
    settings: CustomerSetting
  }

  type CustomerResponse {
    ok: Boolean!
    customer: Customer
    error: Error
  }

  input CreateCustomerInput {
    email: String!
    firstName: String!
    middleName: String
    lastName: String!
    suffix: String
    phoneNumber: String
    password: String!
  }

  input UpdateCustomerInput {
    customerId: String!
    email: String
    firstName: String
    middleName: String
    lastName: String
    suffix: String
    phoneNumber: String
    isActive: Boolean
  }

  input UpdateCustomerSettingsInput {
    customerId: String!
    searchDistance: Int!
  }

  input UpdateCustomerPasswordInput {
    customerId: String!
    password: String!
  }

  input CustomerSignupInput {
    email: String!
    password: String!
  }
  input AddItemToCartInput {
    rxId: String!
    quantity: Int
    price: Float
  }

  input RemoveRxFromCartInput {
    customerId: String!
    rxId: String!
  }

  input RequestRefillInput {
    customerId: String!
    isDelivery: Boolean
  }

  type Query {
    getCustomerById(customerId: String!): CustomerResponse!
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput!): CustomerResponse!
    updateCustomer(input: UpdateCustomerInput!): CustomerResponse!
    updateCustomerPassword(input: UpdateCustomerPasswordInput!): GeneralResponse
    updateCustomerSettings(
      input: UpdateCustomerSettingsInput!
    ): CustomerResponse!
    customerSignup(input: CustomerSignupInput!): GeneralResponse
    addRxToCart(input: AddItemToCartInput!): CustomerResponse!
    removeRxFromCart(input: RemoveRxFromCartInput!): CustomerResponse!
    requestRefill(input: RequestRefillInput!): CustomerResponse!
  }
  type Subscription {
    cartModified: CustomerResponse
  }
`;

module.exports = typeDefs;
