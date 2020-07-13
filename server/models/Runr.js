const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const isPhone = require('is-phone');

const Schema = mongoose.Schema;

const RunrSchema = new Schema({
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
  googleId: { type: String },
  facebookId: { type: String },
  isActive: { type: Boolean, default: false },
  confirmToken: { type: String },
  thumbnailUri: { type: String },
  available: {
    type: Boolean,
    default: true,
  },
  assigned: [String],
  delivered: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt password in database;
RunrSchema.pre('save', async function () {
  const runr = this;
  if (runr.isModified('password')) {
    const { hashPassword } = require('../utils/authentication');
    runr.password = await hashPassword(runr.password);
  }
});

module.exports = mongoose.model('Runr', RunrSchema);
