const mongoose = require('mongoose');
const { paymentStatus, orderStatus, paymentMethod } = require('../util/enums');

const Schema = mongoose.Schema;

const stripeSchema = new Schema({
  orderId: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  items: [
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
  orderStatus: {
    type: String,
    enum: orderStatus,
  },
  orderAmount: { type: Number, required: true },
  statusQueue: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    enum: paymentMethod,
    type: String,
    required: true,
    default: paymentMethod[0],
  },
  stripeCreatePayment: {
    type: Object,
    default: null,
  },
  stripePaymentResponse: {
    type: Object,
    default: null,
  },
  paymentId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Stripe', stripeSchema);
