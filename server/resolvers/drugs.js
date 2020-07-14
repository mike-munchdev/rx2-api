const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Drug = require('../models/Drug');

const connectDatabase = require('../models/connectDatabase');
const { createGeneralResponse } = require('../utils/responses');
const { pick, omit } = require('lodash');
const { importDrugs } = require('../utils/importDrugs');

module.exports = {
  Mutation: {
    importDrugs: async (parent, input, { isAdmin }) => {
      try {
        await connectDatabase();
        if (!isAdmin) throw new Error(ERRORS.AUTH.DENIED);

        await importDrugs();

        return createGeneralResponse({
          ok: true,
          message: 'Completed',
        });
      } catch (error) {
        return createGeneralResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
