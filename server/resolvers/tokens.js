const moment = require('moment');

const CustomerCode = require('../models/CustomerCode');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const { generateToken } = require('../utils/tokens');
const User = require('../models/User');

const connectDatabase = require('../models/connectDatabase');

const createTokenResponse = ({ ok, token = null, errors = null }) => ({
  ok,
  token,
  errors,
});

const getUserFromUserNameAndPassword = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer;
      if (username && password) {
        const customerCode = await CustomerCode.findOne({
          email: username,
          password,
        });
        if (!customerCode) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
        const expiry = moment(customerCode.expiry);
        const now = moment();
        if (expiry.isBefore(now)) throw new Error(ERRORS.CODE.EXPIRED);

        // TODO: check for accounts in db for this user/code
        const customer = await Customer.findOne({
          phoneNumber,
          _id: customerCode.customerId,
        });
        customer.code = customerCode.code;
        resolve(customer);
      } else if (customerId) {
        const customer = await Customer.findById(customerId);
        resolve(customer);
      }
      if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};
module.exports = {
  Query: {
    getTokenByUserNameAndPassword: async (
      parent,
      { username, password },
      context
    ) => {
      try {
        await connectDatabase();

        const user = await getUserFromUserNameAndPassword({
          username,
          password,
        });

        const token = await generateToken({
          user: {
            displayName: `${customer.firstName} ${customer.lastName}`,
            code: customer.code,
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
          errors: convertError(error),
        });
      }
    },
  },
};
