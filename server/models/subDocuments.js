const mongoose = require('mongoose');

module.exports.addressSchema = new mongoose.Schema({
  streetInfo: { type: String },
  unitInfo: { type: String },
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
  filledDate: { type: Date, unique: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports.pharmacyHoursSchema = new mongoose.Schema({
  day: { type: Number },
  hoursStart: { type: String },
  hoursEnd: { type: String },
  isClosed: { type: Boolean },
  isDefault: { type: Boolean },
  isActive: { type: Boolean },
});

module.exports.shoppingCartSchema = new mongoose.Schema({
  rx: { type: mongoose.Schema.Types.ObjectId, ref: 'Rx' },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports.pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

module.exports.settingsSchema = new mongoose.Schema({
  searchDistance: { type: Number, default: 10 },
});

module.exports.newRxQueueSchema = new mongoose.Schema({
  uri: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
