const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const isPhone = require('is-phone');
const { addressSchema, paymentTypeSchema } = require('./subDocuments');

const CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
    unique: true,
  },
  password: { type: String, required: false },
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  suffix: { type: String, required: false },
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => isPhone(v),
      message: 'Phone validation failed',
    },
    required: false,
  },
  addresses: [addressSchema],
  paymentMethods: [addressSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  stripeId: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  isActive: { type: Boolean, default: false },
  confirmToken: { type: String },
});

// TODO: encrypt password in database;
CustomerSchema.pre('save', async function () {
  const customer = this;
  if (customer.isModified('password')) {
    const { hashPassword } = require('../utils/authentication');
    customer.password = await hashPassword(customer.password);
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
