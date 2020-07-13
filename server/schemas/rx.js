const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Rx {
    id: ID!
    rxNumber: String
    numberOfRefillsAllowed: Int
    filledDate: Date!
    refills: [Refills!]
    dosage: String!
    daySupply: Int!
    doctor: Doctor
    drug: Drug!
    customer: Customer!
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
    filledDate: Date!
  }

  input UpdateRxInput {
    rxNumber: String
    numberOfRefillsAllowed: Int
    dosage: String
    daySupply: Int
    directions: String
    drugId: String
    doctorId: String
    customerId: String
    rxId: String!
    filledDate: Date
  }

  input RefillRxInput {
    rxId: String!
    pharmacyId: String
    filledDate: Date
  }

  type Query {
    getRxById(rxId: String!): RxResponse
    getMyRxHistory: RxsResponse
  }

  type Mutation {
    createRx(input: CreateRxInput!): RxResponse
    updateRx(input: UpdateRxInput!): RxResponse
    refillRx(input: RefillRxInput!): RxResponse
  }
`;

module.exports = typeDefs;
