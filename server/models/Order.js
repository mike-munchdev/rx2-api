const mongoose = require('mongoose');
const { paymentStatus, orderStatus, paymentMethod } = require('../utils/enums');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  deliveryAddress: {
    type: String,
    required: true,
  },
  rxs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Rx',
    },
  ],
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  paymentStatus: {
    type: String,
    enum: paymentStatus,
    default: paymentStatus[0],
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
  },
  status: {
    type: Boolean,
    default: null,
  },
  orderStatus: {
    type: String,
    enum: orderStatus,
  },
  statusQueue: {
    type: Object,
    required: true,
  },
  paidAmount: { type: Number },
  orderAmount: { type: Number, required: true },
  deliveryCharges: { type: Number },
  paymentMethod: {
    enum: paymentMethod,
    type: String,
    required: true,
    default: paymentMethod[0],
  },
  reason: { type: String },
  runr: {
    type: Schema.Types.ObjectId,
    ref: 'Runr',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);
