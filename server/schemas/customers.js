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
    phoneNumber: String!
    addresses: [Address!]
    paymentMethods: [PaymentMethods!]
    stripeId: String
    googleId: String
    facebookId: String
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
  }

  input UpdateCustomerPassword {
    customerId: String!
    password: String!
  }

  type Query {
    getCustomerById(customerId: String!): CustomerResponse
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput!): CustomerResponse
    updateCustomer(input: UpdateCustomerInput!): CustomerResponse
    updateCustomerPassword(input: UpdateCustomerPassword!): GeneralResponse
    customerSignUp(input: CreateCustomerInput!): CustomerResponse
  }
`;

module.exports = typeDefs;
