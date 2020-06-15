const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const { refillsSchema } = require('./subDocuments');

const PerscriptionSchema = new mongoose.Schema({
  numberOfRefillsAllowed: { type: Number },
  refills: [refillsSchema],
  drug: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Perscription', PerscriptionSchema);
