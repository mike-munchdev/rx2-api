const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Rx = require('../models/Rx');
const Mail = require('../models/Mail');

const connectDatabase = require('../models/connectDatabase');
const { createRxResponse, createRxsResponse } = require('../utils/responses');
const { RESPONSES } = require('../constants/responses');
const { pick } = require('lodash');

module.exports = {
  Query: {
    getRxById: async (parent, { rxId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this rx/code
        const rx = await Rx.findById(rxId);

        if (!rx) throw new Error(ERRORS.RX.NOT_FOUND_WITH_PROVIDED_INFO);

        return createRxResponse({
          ok: true,
          rx,
        });
      } catch (error) {
        return createRxResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    getMyRxHistory: async (parent, args, { isAdmin, user }) => {
      try {
        await connectDatabase();

        // console.log('user.id', user.id);
        // TODO: check for accounts in db for this rx/code
        const rxs = await Rx.find({ customer: user.id })
          .populate('drug', 'brand_name labeler_name generic_name')
          .populate('customer', 'firstName lastName')
          .populate('doctor', 'firstName lastName middleName prefix');
        // console.log('rxs', rxs);

        return createRxsResponse({
          ok: true,
          rxs,
        });
      } catch (error) {
        return createRxsResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createRx: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();

        let rx = await Rx.create({
          ...input,
        });

        if (input.drugId) {
          rx.drug = input.drugId;
        }
        if (input.doctorId) {
          rx.doctor = input.doctorId;
        }
        if (input.customerId) {
          rx.customer = input.customerId;
        }
        await rx.save();

        return createRxResponse({
          ok: true,
          rx,
        });
      } catch (error) {
        return createRxResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    updateRx: async (parent, { input }, { isAdmin }) => {
      try {
        const { rxId } = input;
        if (!rxId) throw new Error(ERRORS.RX.NOT_FOUND);

        await connectDatabase();

        let rx = await Rx.findOneAndUpdate({ _id: rxId }, input, {
          upsert: false,
        });

        if (input.drugId) {
          rx.drug = input.drugId;
        }
        if (input.doctorId) {
          rx.doctor = input.doctorId;
        }
        if (input.customerId) {
          rx.customer = input.customerId;
        }
        await rx.save();

        rx = rx.toObject();
        rx.id = rx._id;

        return createRxResponse({
          ok: true,
          rx,
        });
      } catch (error) {
        return createRxResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    refillRx: async (parent, { input }, { isAdmin }) => {
      try {
        const { rxId } = input;
        if (!rxId) throw new Error(ERRORS.RX.NOT_FOUND);

        await connectDatabase();

        let rx = await Rx.findById(rxId);

        if (rx.refills.length === rx.numberOfRefillsAllowed)
          throw new Error(ERRORS.RX.NO_MORE_REFILLS_ALLOWED);

        input.pharmacy = input.pharmacyId;
        rx.refills.push(pick(input, ['filledDate', 'pharmacy']));
        await rx.save();

        return createRxResponse({
          ok: true,
          rx,
        });
      } catch (error) {
        return createRxResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
