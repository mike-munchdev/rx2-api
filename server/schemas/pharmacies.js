const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type PharmacyHour {
    id: ID!
    day: Int!
    hoursStart: String
    hoursEnd: String
    isClosed: Boolean
  }
  type Location {
    type: String!
    coordinates: [Float!]
  }
  type Pharmacy {
    id: ID!
    name: String!
    address: Address
    location: Location
    phoneNumber: String
    website: String
    distance: Float
    canPickup: Boolean!
    canDeliver: Boolean!
    imgUrl: String
    thumbnailUrl: String
    is24Hour: Boolean!
    timeZone: String
    deliveryFee: Float
    deliveryFeeType: String
    observesDST: Boolean!
    hours: [PharmacyHour]
  }

  type PharmaciesResponse {
    ok: Boolean!
    pharmacies: [Pharmacy!]
    error: Error
  }
  type PharmacyResponse {
    ok: Boolean!
    pharmacy: Pharmacy
    error: Error
  }

  input HoursInput {
    day: String!
    hoursStart: Date
    hoursEnd: Date
    isClosed: Boolean
  }

  input CreatePharmacyInput {
    name: String!
    streetInfo: String!
    unitInfo: String
    city: String!
    state: String!
    zipCode: String!
    latitude: Float!
    longitude: Float!
    phoneNumber: String
    website: String
    canPickup: Boolean
    canDeliver: Boolean
    imgUrl: String
    thumbnailUrl: String
    is24Hour: Boolean
    timeZone: String
    deliveryFee: Float
    deliveryFeeType: String
    observesDST: Boolean
    hours: [HoursInput!]
  }

  input UpdatePharmacyInput {
    pharmacyId: String!
    name: String
    streetInfo: String
    unitInfo: String
    city: String
    state: String
    zipCode: String
    latitude: Float
    longitude: Float
    phoneNumber: String
    website: String
    canPickup: Boolean
    canDeliver: Boolean
    imgUrl: String
    thumbnailUrl: String
    is24Hour: Boolean
    timeZone: String
    deliveryFee: Float
    deliveryFeeType: String
    observesDST: Boolean
    hours: [HoursInput!]
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
    distance: Int!
  }

  type Query {
    getPharmacies: PharmaciesResponse
    getPharmaciesNearLocation(input: LocationInput!): PharmaciesResponse
  }

  type Mutation {
    createPharmacy(input: CreatePharmacyInput): PharmacyResponse
    updateOnePharmacy(input: UpdatePharmacyInput): PharmacyResponse
  }
`;

module.exports = typeDefs;
