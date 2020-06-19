const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Rx {
    id: ID!
    rxNumber: String
    numberOfRefillsAllowed: Int
    refills: [Refills!]
    dosage: String!
    daySupply: Int!
    doctor: Doctor
    drug: Drug!
    customerId: String
    createdAt: Date!
  }

  type RxResponse {
    ok: Boolean!
    rx: Rx
    error: Error
  }

  type RxsResponse {
    ok: Boolean!
    rxs: [Rx!]
    error: Error
  }

  input CreateRxInput {
    rxNumber: String!
    numberOfRefillsAllowed: Int!
    dosage: String!
    daySupply: Int!
    directions: String!
    drugId: String!
    doctorId: String!
    customerId: String!
  }

  input UpdateRxInput {
    rxNumber: String
    numberOfRefillsAllowed: Int
    dosage: String
    daySupply: Int
    directions: String
    drugId: String
    doctorId: String
    rxId: String!
  }

  type Query {
    getRxById(rxId: String!): RxResponse
    getMyRxHistory: RxsResponse
  }

  type Mutation {
    createRx(input: CreateRxInput!): RxResponse
    updateRx(input: UpdateRxInput!): RxResponse
  }
`;

module.exports = typeDefs;
