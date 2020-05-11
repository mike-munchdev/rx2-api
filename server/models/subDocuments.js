const mongoose = require('mongoose');

module.exports.addressSchema = new mongoose.Schema({
  address: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  isDefault: { type: Boolean },
  isDelivery: { type: Boolean },
});
