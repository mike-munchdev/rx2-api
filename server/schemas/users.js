const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type User {
    id: ID!
    email: String
    firstName: String!
    middlename: String
    lastName: String!
    suffix: String
    phoneNumber: String!
    addresses: [Address!]
  }

  type UserResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  input CreateUserInput {
    email: String!
    firstName: String!
    middlename: String
    lastName: String!
    suffix: String
    phoneNumber: String
  }

  input UpdateUserInput {
    userId: String!
    email: String
    firstName: String
    middlename: String
    lastName: String
    suffix: String
    phoneNumber: String
  }

  input UpdateUserPassword {
    userId: String!
    password: String!
  }

  type Query {
    getUserById(userId: String!): UserResponse
  }

  type Mutation {
    createUser(input: CreateUserInput!): UserResponse
    updateUser(input: UpdateUserInput!): UserResponse
    updateUserPassword(input: UpdateUserPassword!): GeneralResponse
  }
`;

module.exports = typeDefs;
