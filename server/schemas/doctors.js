const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Doctor {
    id: ID!
    email: String
    firstName: String!
    middleName: String
    lastName: String!
    prefix: String!
    suffix: String
    phoneNumber: String
    address: Address
    isActive: Boolean
    createdAt: Date!
  }

  type DoctorResponse {
    ok: Boolean!
    doctor: Doctor
    error: Error
  }

  input CreateDoctorInput {
    email: String!
    firstName: String!
    middleName: String
    lastName: String!
    suffix: String
    phoneNumber: String
    prefix: String
    address: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
  }

  input UpdateDoctorInput {
    doctorId: String!
    email: String
    firstName: String
    middleName: String
    lastName: String
    suffix: String
    phoneNumber: String
    prefix: String
  }

  type Query {
    getDoctorById(doctorId: String!): DoctorResponse
  }

  type Mutation {
    createDoctor(input: CreateDoctorInput!): DoctorResponse
    updateDoctor(input: UpdateDoctorInput!): DoctorResponse
  }
`;

module.exports = typeDefs;
