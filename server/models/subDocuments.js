const mongoose = require('mongoose');

module.exports.addressSchema = new mongoose.Schema({
  address: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  isDefault: { type: Boolean },
  isDelivery: { type: Boolean },
  type: { type: String },
});

module.exports.paymentMethodSchema = new mongoose.Schema({
  stripeId: { type: String },
  isDefault: { type: Boolean },
  isActive: { type: Boolean },
});

module.exports.refillsSchema = new mongoose.Schema({
  filledDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
