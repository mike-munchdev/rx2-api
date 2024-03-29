const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const connectDatabase = require('../models/connectDatabase');
const { default: Bugsnag } = require('@bugsnag/js');

module.exports.validateToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secret);

      resolve(decoded);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.findCustomerByToken = (decoded) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (decoded.info.id) {
        await connectDatabase();
        const customer = await Customer.findById(decoded.info.id);

        resolve(customer);
      } else {
        throw new Error('Malformed token');
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.generateToken = ({ user, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 30);
      const token = jwt.sign(
        {
          info: user,
          type,
          exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
        },
        process.env.JWT_SECRET
      );

      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.comparePassword = ({ password, candidatePassword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!password) {
        throw new Error('Password not set.');
      }

      const isMatch = await bcrypt.compare(candidatePassword, password);

      resolve(isMatch);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    Bugsnag.notify(e);
  }
};
