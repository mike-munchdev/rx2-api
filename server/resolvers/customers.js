const shortid = require('shortid');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Customer = require('../models/Customer');

const connectDatabase = require('../models/connectDatabase');

const createCustomerResponse = ({ ok, customer = null, error = null }) => ({
  ok,
  customer,
  error,
});

module.exports = {
  Query: {
    getCustomerById: async (parent, { customerId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this customer/code
        const customer = await Customer.findById(customerId);

        if (!customer)
          throw new Error('No customer found with the provided information.');

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
  Mutation: {
    customerSignUp: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
      } catch (error) {}
    },
    updateCustomerPassword: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
        // TODO: check for accounts in db for this customer/code
        let customer = await Customer.findOneAndUpdate(
          { _id: input.customerId },
          { password: input.password },
          {
            upsert: false,
          }
        );

        if (!customer)
          throw new Error('No customer found with the provided information.');

        return;
      } catch (error) {}
    },
    createCustomer: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();

        let customer = await Customer.create({
          ...input,
        });

        customer = customer.toObject();
        customer.id = customer._id;

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    updateCustomer: async (parent, { input }, { isAdmin }) => {
      try {
        const { customerId } = input;
        if (!customerId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        await connectDatabase();

        let customer = await Customer.findOneAndUpdate(
          { _id: customerId },
          input,
          {
            upsert: false,
          }
        );

        customer = customer.toObject();
        customer.id = customer._id;

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
