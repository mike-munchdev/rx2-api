const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const { refillsSchema } = require('./subDocuments');

const Schema = mongoose.Schema;

const RxSchema = new Schema({
  rxNumber: { type: String },
  numberOfRefillsAllowed: { type: Number },
  refills: [refillsSchema],
  dosage: { type: String },
  daySupply: { type: Number },
  directions: { type: String },
  drug: { type: Schema.Types.ObjectId, ref: 'Drug' },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  filledDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RxSchema.method('transform', function () {
  let obj = this.toObject();
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
