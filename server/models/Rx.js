const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const { refillsSchema } = require('./subDocuments');

const RxSchema = new mongoose.Schema({
  rxNumber: { type: String },
  numberOfRefillsAllowed: { type: Number },
  refills: [refillsSchema],
  dosage: { type: String },
  daySupply: { type: Number },
  directions: { type: String },
  drugId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RxSchema.method('transform', function () {
  var obj = this.toObject();
  console.log('rx transform');
  //Rename fields

  obj.id = obj._id;
  delete obj._id;
  obj.refills = obj.refills.map((r) => {
    r.id = r._id;
    delete r._id;
    return r;
  });
  return obj;
});
module.exports = mongoose.model('Rx', RxSchema);
