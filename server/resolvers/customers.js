const randomstring = require('randomstring');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Customer = require('../models/Customer');
const Mail = require('../models/Mail');

const connectDatabase = require('../models/connectDatabase');
const {
  createCustomerResponse,
  createGeneralResponse,
} = require('../utils/responses');
const { RESPONSES } = require('../constants/responses');

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
    customerSignup: async (parent, { input }, { isAdmin }) => {
      try {
        console.log('customerSignup');
        await connectDatabase();

        // TODO: check for unique email
        const customerWithEmailCount = await Customer.countDocuments({
          email: input.email,
        });
        if (customerWithEmailCount !== 0)
          throw new Error(ERRORS.CUSTOMER.ACCOUNT_EMAIL_TAKEN);

        // TODO: add customer to database as inactive
        const customer = await Customer.create({
          ...input,
          confirmToken: randomstring.generate({
            length: 12,
            charset: 'alphanumeric',
          }),
        });

        // TODO: add mail to queue
        const mail = await Mail.create({
          mailFrom: process.env.MAIL_FROM_ADDRESS,
          mailTo: customer.email,
          subject: RESPONSES.EMAIL.SIGN_UP_EMAIL.subject,
          html: RESPONSES.EMAIL.SIGN_UP_EMAIL.body
            .replace(
              '{REGISTER_URL}',
              `${process.env.REGISTER_URL}/${customer.confirmToken}`
            )
            .replace('{COMPANY_INFO}', `${process.env.COMPANY_INFO}`)
            .replace('{SOCIAL_MEDIA_LINKS}', ''),
        });

        return createGeneralResponse({
          ok: true,
          message: RESPONSES.CUSTOMER.SIGNUP_SUCCESSFUL,
        });
      } catch (error) {
        console.log('error', error);
        return createGeneralResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
