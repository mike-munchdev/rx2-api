const moment = require('moment');
const { comparePassword } = require('../utils/authentication');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const { generateToken } = require('../utils/authentication');
const Customer = require('../models/Customer');
const connectDatabase = require('../models/connectDatabase');

const createTokenResponse = ({ ok, token = null, error = null }) => ({
  ok,
  token,
  error,
});

module.exports = {
  Query: {
    getCustomerTokenByEmailAndPassword: async (
      parent,
      { email, password },
      context
    ) => {
      try {
        await connectDatabase();
        const customer = await Customer.findOne({ email });

        if (!customer)
          throw new Error(ERRORS.CUSTOMER.NOT_FOUND_WITH_PROVIDED_INFO);

        const isMatch = await comparePassword({
          password: customer.password,
          candidatePassword: password,
        });

        const token = await generateToken({
          user: {
            displayName: `${customer.firstName} ${customer.lastName}`,
            id: customer.id,
          },
          type: 'Customer',
        });

        return createTokenResponse({
          ok: true,
          token,
        });
      } catch (error) {
        console.log('error', error);
        return createTokenResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
