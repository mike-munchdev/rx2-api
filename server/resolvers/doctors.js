const randomstring = require('randomstring');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Doctor = require('../models/Doctor');
const Mail = require('../models/Mail');

const connectDatabase = require('../models/connectDatabase');
const { createDoctorResponse } = require('../utils/responses');
const { pick, omit } = require('lodash');

module.exports = {
  Query: {
    getDoctorById: async (parent, { doctorId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this doctor/code
        const doctor = await Doctor.findById(doctorId);

        if (!doctor)
          throw new Error(ERRORS.DOCTOR.NOT_FOUND_WITH_PROVIDED_INFO);

        return createDoctorResponse({
          ok: true,
          doctor,
        });
      } catch (error) {
        return createDoctorResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createDoctor: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();
        const address = pick(input, addressFields);
        const doctorFields = omit(input, addressFields);

        let doctor = await Doctor.create({
          ...doctorFields,
          address,
        });

        return createDoctorResponse({
          ok: true,
          doctor: doctor,
        });
      } catch (error) {
        return createDoctorResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
    updateDoctor: async (parent, { input }, { isAdmin }) => {
      try {
        const { doctorId } = input;
        if (!doctorId) throw new Error(ERRORS.DOCTOR.NOT_FOUND);

        await connectDatabase();

        let doctor = await Doctor.findOneAndUpdate({ _id: doctorId }, input, {
          upsert: false,
        });

        doctor = doctor.toObject();
        doctor.id = doctor._id;

        return createDoctorResponse({
          ok: true,
          doctor,
        });
      } catch (error) {
        return createDoctorResponse({
          ok: false,
          error: convertError(error),
        });
      }
    },
  },
};
