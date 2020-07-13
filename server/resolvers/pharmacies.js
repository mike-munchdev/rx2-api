const {
  createPharmacyResponse,
  createPharmaciesResponse,
} = require('../utils/responses');
const convertErrors = require('../utils/convertErrors');

const { createPharmacy, updatePharmacy } = require('../utils/pharmacies');
const connectDatabase = require('../models/connectDatabase');
const Pharmacies = require('../models/Pharmacies');
const { omit } = require('lodash');

module.exports = {
  Query: {
    getPharmacies: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
        console.log('getPharmacies');
        const pharmacies = await Pharmacies.find().populate('hours');
        // .populate('address', 'address');

        console.log('pharmacies', pharmacies);
        return createPharmaciesResponse({
          ok: true,
          pharmacies,
        });
      } catch (error) {
        return createPharmaciesResponse({
          ok: false,
          error: convertErrors(error),
        });
      }
    },
    getPharmaciesNearLocation: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
        const pharmacies = await Pharmacies.aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [input.longitude, input.latitude],
              },
              spherical: true,
              maxDistance: Number(input.distance || 10) * 1609.34,
              distanceMultiplier: 1 / 1609.34,
              distanceField: 'distance',
            },
          },
        ]).exec();

        return createPharmaciesResponse({
          ok: true,
          pharmacies,
        });
      } catch (error) {
        return createPharmaciesResponse({
          ok: false,
          error: convertErrors(error),
        });
      }
    },
  },
  Mutation: {
    updateOnePharmacy: async (_, { input }, { db }) => {
      try {
        await connectDatabase();
        const pharmacyDb = await updatePharmacy({
          input,
        });

        return createPharmacyResponse({ ok: true, pharmacy: pharmacyDb });
      } catch (error) {
        return createPharmacyResponse({
          ok: false,
          error: convertErrors(error),
        });
      }
    },
    createPharmacy: async (_, { input }, { db }) => {
      try {
        // TODO: authorization check

        const location = {
          type: 'Point',
          coordinates: [input.longitude, input.latitude],
        };
        const body = omit(input, ['longitude', 'latitude']);

        await connectDatabase();
        // add pharmacy
        const pharmacy = await createPharmacy({
          input: { ...body, location },
        });

        return createPharmacyResponse({ ok: true, pharmacy });
      } catch (error) {
        return createPharmacyResponse({
          ok: false,
          error: convertErrors(error),
        });
      }
    },
  },
};
