const moment = require('moment');
const { comparePassword } = require('../utils/authentication');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const { generateToken } = require('../utils/authentication');
const Customer = require('../models/Customer');
const connectDatabase = require('../models/connectDatabase');
const { createTokenResponse } = require('../utils/responses');
const { cartPopulateObject } = require('../utils/populateObjects');

module.exports = {
  Query: {
    getCustomerTokenByEmailAndPassword: async (
      parent,
      { email, password },
      context
    ) => {
      try {
        await connectDatabase();
        const customer = await Customer.findOne({ email }).populate(
          cartPopulateObject
        );

        if (!customer)
          throw new Error(ERRORS.CUSTOMER.EMAIL_AND_PASSWORD_INCORRECT);

        const isMatch = await comparePassword({
          password: customer.password,
          candidatePassword: password,
        });

        if (!isMatch)
          throw new Error(ERRORS.CUSTOMER.EMAIL_AND_PASSWORD_INCORRECT);

        console.log('generateToken: customer', customer);
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
          customer,
        });
      } catch (error) {
        return createTokenResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
