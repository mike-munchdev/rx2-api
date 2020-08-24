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
    address: Address
    paymentMethods: [PaymentMethods!]
    cart: [ShoppingCart!]
    stripeId: String
    googleId: String
    facebookId: String
    pushTokens: [String!]
    isActive: Boolean
    confirmToken: String
    thumbnailUri: String
    createdAt: Date!
    settings: CustomerSetting
  }

  type CustomerResponse {
    ok: Boolean!
    customer: Customer
    pushToken: String
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
    streetInfo: String
    unitInfo: String
    city: String
    state: String
    zipCode: String
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
    firstName: String!
    lastName: String!
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

  input AddNewRxsToQueueInput {
    customerId: String!
    uris: [String!]
  }
  input AddPushToken {
    customerId: String!
    pushToken: String!
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
    addNewRxsToQueue(input: AddNewRxsToQueueInput!): CustomerResponse!
    addPushToken(input: AddPushToken!): CustomerResponse!
    removeRxFromCart(input: RemoveRxFromCartInput!): CustomerResponse!
    requestRefill(input: RequestRefillInput!): CustomerResponse!
    activateCustomerAccount(confirmToken: String!): GeneralResponse
  }
  type Subscription {
    cartModified: CustomerResponse
  }
`;

module.exports = typeDefs;
