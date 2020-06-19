const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const isPhone = require('is-phone');
const { addressSchema } = require('./subDocuments');

const DoctorSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
    unique: true,
  },
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  prefix: { type: String, required: false },
  suffix: { type: String, required: false },
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => isPhone(v),
      message: 'Phone validation failed',
    },
    required: false,
  },
  address: addressSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false },
});

DoctorSchema.method('transform', function () {
  var obj = this.toObject();
  console.log('doctor transform');
  //Rename fields
  obj.address.id = obj.address._id;
  obj.id = obj._id;
  delete obj._id;
  delete obj.address._id;

  return obj;
});

module.exports = mongoose.model('Doctor', DoctorSchema);
