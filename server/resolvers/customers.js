const { withFilter } = require('apollo-server-express');
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
const pubsub = require('../utils/pubsub');
const { CART_MODIFIED } = require('../constants/triggers');
const { pick, omit } = require('lodash');
const {
  cartPopulateObject,
  settingsPopulateObject,
} = require('../utils/populateObjects');

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
        console.log('updateCustomerPassword');
        let customer = await Customer.findById(input.customerId);
        console.log('customer', customer);

        if (!customer)
          throw new Error('No customer found with the provided information.');

        customer.password = input.password;
        customer.save();
        return createGeneralResponse({
          ok: true,
          message: RESPONSES.CUSTOMER.PASSWORD_CHANGED,
        });
      } catch (error) {
        return createGeneralResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    updateCustomerSettings: async (parent, { input }, { user }) => {
      try {
        const { customerId } = input;
        if (!customerId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
        await connectDatabase();
        console.log('updateCustomerSettings', input);

        // TODO: check for accounts in db for this customer/code
        await Customer.findOneAndUpdate(
          { _id: input.customerId },
          { settings: { ...omit(input, ['customerId']) } },
          {
            upsert: false,
          }
        );

        const customer = await Customer.findById(customerId).populate(
          cartPopulateObject
        );

        return createCustomerResponse({
          ok: true,
          customer,
        });

        if (!customer)
          throw new Error('No customer found with the provided information.');

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: true,
          error: convertError(error),
        });
      }
    },
    createCustomer: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();

        let customer = await Customer.create({
          ...input,
        });

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

        await Customer.findOneAndUpdate({ _id: customerId }, input, {
          upsert: false,
        });

        const customer = await Customer.findById(customerId).populate(
          cartPopulateObject
        );

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
        return createGeneralResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    addRxToCart: async (parent, { input }, { isAdmin, user }) => {
      try {
        await connectDatabase();

        const customer = await Customer.findById(user._id).populate(
          cartPopulateObject
        );

        input.rx = input.rxId;

        const existingCartItem = customer.cart.find((c) => {
          return c.rx.toString() === input.rxId;
        });

        if (existingCartItem)
          throw new Error(ERRORS.CUSTOMER.RX_ALREADY_EXISTS_IN_CART);

        customer.cart.push({
          rx: input.rx,
          quantity: input.quantity,
          price: input.price,
        });

        await customer.save();

        const updatedCustomer = await Customer.findById(user._id).populate(
          cartPopulateObject
        );

        // console.log('publishing', CART_MODIFIED);
        // pubsub.publish(CART_MODIFIED, { cartModified: response });
        return createCustomerResponse({
          ok: true,
          customer: updatedCustomer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          error,
        });
      }
    },
    removeRxFromCart: async (parent, { input }, { isAdmin, user }) => {
      try {
        await connectDatabase();
        const customer = await Customer.findById(input.customerId).populate(
          'cart'
        );

        console.log('customer before pull', customer.cart);
        customer.cart.pull({ _id: input.rxId });

        console.log('customer after pull', customer.cart);
        await customer.save();

        const updatedCustomer = await Customer.findById(
          input.customerId
        ).populate(cartPopulateObject);

        console.log('updatedCustomer', updatedCustomer);
        // pubsub.publish(CART_MODIFIED, { cartModified: response });
        return createCustomerResponse({
          ok: true,
          customer: updatedCustomer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          error,
        });
      }
    },
    requestRefill: async (parent, { input }, { isAdmin, user }) => {
      try {
        await connectDatabase();
        console.log('customerId', input.customerId);
        const customer = await Customer.findById(input.customerId).populate(
          cartPopulateObject
        );

        customer.cart = [];
        await customer.save();
        // handle refill
        // create order from cart
        // remove all items from cart
        // return customer object with empty cart.
        console.log('found customer');
        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          error,
        });
      }
    },

    addNewRxsToQueue: async (parent, { input }, { isAdmin, user }) => {
      try {
        await connectDatabase();

        const { customerId, uris } = input;
        if (!customerId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
        const customer = await Customer.findById(customerId).populate(
          cartPopulateObject
        );
        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        const existingQueueItem = customer.queue.find((q) => {
          return uris.findIndex((u) => u === q.uri) >= 0;
        });

        if (existingQueueItem)
          throw new Error(ERRORS.CUSTOMER.RX_ALREADY_EXISTS_IN_QUEUE);

        customer.queue.push({
          $each: input.uris.map((u) => ({
            uri: u,
          })),
        });

        await customer.save();

        const updatedCustomer = await Customer.findById(
          input.customerId
        ).populate(cartPopulateObject);

        return createCustomerResponse({
          ok: true,
          customer: updatedCustomer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          error,
        });
      }
    },
    addPushToken: async (parent, { input }, { isAdmin, user }) => {
      try {
        await connectDatabase();
        console.log('addPushToken', input);
        const { customerId, pushToken } = input;
        if (!customerId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
        const customer = await Customer.findById(customerId).populate(
          cartPopulateObject
        );
        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        const existingPushToken = customer.pushTokens.find((t) => {
          return t === pushToken;
        });

        if (!existingPushToken)
          throw new Error(ERRORS.CUSTOMER.PUSH_TOKEN_ALREADY_EXISTS);

        customer.pushTokens.push(pushToken);

        await customer.save();

        const updatedCustomer = await Customer.findById(
          input.customerId
        ).populate(cartPopulateObject);

        return createCustomerResponse({
          ok: true,
          customer: updatedCustomer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          error,
        });
      }
    },
  },
  Subscription: {
    cartModified: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CART_MODIFIED),
        (payload, variables, { user }) => {
          console.log(
            'payload.cartModified.customer.id',
            typeof payload.cartModified.customer.id
          );
          return (
            payload.cartModified.customer.id.toString() === user.id.toString()
          );
        }
      ),
    },
  },
};
