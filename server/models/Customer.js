const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const isPhone = require('is-phone');
const {
  addressSchema,
  paymentMethodSchema,
  shoppingCartSchema,
  settingsSchema,
  newRxQueueSchema,
} = require('./subDocuments');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
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
  paymentMethods: [paymentMethodSchema],
  cart: [shoppingCartSchema],
  queue: [newRxQueueSchema],
  settings: settingsSchema,
  stripeId: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  isActive: { type: Boolean, default: false },
  confirmToken: { type: String },
  pushTokens: [String],
  thumbnailUri: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt password in database;
CustomerSchema.pre('save', async function () {
  const customer = this;
  if (customer.isModified('password')) {
    const { hashPassword } = require('../utils/authentication');
    customer.password = await hashPassword(customer.password);
  }
});

CustomerSchema.method('transform', function () {
  let obj = this.toObject();
  console.log('CustomerSchema transform');
  //Rename fields
  if (obj.addresses) {
    obj.addresses = obj.addresses.map((a) => {
      a.id = a._id;
      delete a._id;
      return a;
    });
  }
  obj.id = obj._id;

  if (obj.cart) {
    obj.cart = obj.cart.map((c) => {
      c.id = c._id;
      delete c._id;

      c.rx.id = c.rx._id;
      delete c.rx._id;
      if (c.rx.drug) {
        c.rx.drug.id = c.rx.drug._id;
        delete c.rx.drug._id;
      }
      return c;
    });
  }

  if (obj.queue) {
    obj.queue = obj.queue.map((q) => {
      q.id = q._id;
      delete q._id;
      return q;
    });
  }

  if (obj.settings) {
    obj.settings.id = obj.settings._id;
    delete obj.settings._id;
  }

  delete obj._id;
  delete obj.password;
  return obj;
});

module.exports = mongoose.model('Customer', CustomerSchema);
