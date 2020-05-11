const shortid = require('shortid');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const User = require('../models/User');

const connectDatabase = require('../models/connectDatabase');

const createUserResponse = ({ ok, user = null, errors = null }) => ({
  ok,
  user,
  errors,
});

module.exports = {
  Query: {
    getUserById: async (parent, { userId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        const user = await User.findById(userId);

        if (!user)
          throw new Error('No user found with the provided information.');

        return createUserResponse({
          ok: true,
          user,
        });
      } catch (error) {
        return createUserResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    updateUserPassword: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
        // TODO: check for accounts in db for this user/code
        let user = await User.findOneAndUpdate(
          { _id: input.userId },
          { password: input.password },
          {
            upsert: false,
          }
        );

        if (!user)
          throw new Error('No user found with the provided information.');

        return;
      } catch (error) {}
    },
    createUser: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();

        let user = await User.create({
          ...input,
        });

        user = user.toObject();
        user.id = user._id;

        return createUserResponse({
          ok: true,
          user,
        });
      } catch (error) {
        return createUserResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    updateUser: async (parent, { input }, { isAdmin }) => {
      try {
        const { userId } = input;
        if (!userId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        await connectDatabase();

        let user = await User.findOneAndUpdate({ _id: userId }, input, {
          upsert: false,
        });

        user = user.toObject();
        user.id = user._id;

        return createUserResponse({
          ok: true,
          user,
        });
      } catch (error) {
        return createUserResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
