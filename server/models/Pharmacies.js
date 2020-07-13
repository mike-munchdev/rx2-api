const mongoose = require('mongoose');

const isPhone = require('is-phone');
const {
  addressSchema,
  pharmacyHoursSchema,
  pointSchema,
} = require('./subDocuments');
const { pharmacyTransform } = require('../utils/pharmacies');

const Schema = mongoose.Schema;

const PharmacySchema = new Schema({
  name: { type: String, required: false },
  address: addressSchema,
  hours: [pharmacyHoursSchema],
  location: {
    type: pointSchema,
    index: '2dsphere',
  },
  website: { type: String },
  imgUri: { type: String },
  thumbnailUri: { type: String },
  timeZone: { type: String },
  deliveryFee: { type: Number },
  deliveryFeeType: { type: String },
  observesDST: { type: Boolean },
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => isPhone(v),
      message: 'Phone validation failed',
    },
    required: false,
  },
  isActive: { type: Boolean, default: false },
  canDeliver: { type: Boolean, default: false },
  canPickup: { type: Boolean, default: true },
  is24Hour: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PharmacySchema.method('transform', function () {
  let obj = this.toObject();
  return pharmacyTransform(obj);
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
