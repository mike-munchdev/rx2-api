const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const { addressSchema } = require('./subDocuments');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
    unique: true,
  },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  suffix: { type: String, required: false },
  addresses: [addressSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt ssn in database;
UserSchema.pre('save', async function () {
  const user = this;
  if (user.isModified('password')) {
  }
});

module.exports = mongoose.model('User', UserSchema);
