const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const { refillSchema } = require('./subDocuments');

const PerscriptionSchema = new mongoose.Schema({
  refillsAllowed: {type: Number}
  refills: [refillSchema],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Perscription', PerscriptionSchema);
