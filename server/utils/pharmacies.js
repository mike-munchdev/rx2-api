const asyncForEach = require('./asyncForEach');
const Pharmacy = require('../models/Pharmacies');
const connectDatabase = require('../models/connectDatabase');
const { pick, omit } = require('lodash');
const { addressFields } = require('./address');
const { addressPopulateObject } = require('./populateObjects');

// const upsertPharmacyHours = ({ pharmacyId, hours }) => {
//   const Op = db.Sequelize.Op;
//   return new Promise(async (resolve, reject) => {
//     await asyncForEach(hours, async (hour, index, array) => {
//       const existingPharmacyHours = await db.pharmacyHours.findOne({
//         where: {
//           day: { [Op.eq]: hour.day },
//           pharmacyId: { [Op.eq]: pharmacyId },
//         },
//       });

//       if (existingPharmacyHours) {
//         await db.pharmacyHours.update(
//           { ...hour, pharmacyId },
//           {
//             where: { id: { [Op.eq]: existingPharmacyHours.id } },
//           }
//         );
//       } else {
//         await db.pharmacyHours.create({ ...hour, pharmacyId });
//       }
//     });
//     resolve();
//   });
// };

module.exports.createPharmacy = ({ input }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      const address = pick(input, addressFields);
      const pharmacyFields = omit(input, addressFields);

      const pharmacy = await Pharmacy.create({
        ...pharmacyFields,
        address,
      });

      resolve(pharmacy);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.updatePharmacy = ({ input }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Op = db.Sequelize.Op;
      const existingPharmacy = await db.pharmacies.findByPk(input.pharmacyId);
      if (!existingPharmacy) throw new Error(ERROR_MESSAGE_PHARMACY_NOT_FOUND);
      // add pharmacy

      // TODO: authorization check
      await db.pharmacies.update(input, {
        where: { id: { [Op.eq]: input.pharmacyId } },
      });

      const newPharmacyDb = await db.pharmacies.findByPk(existingPharmacy.id);
      resolve(newPharmacyDb);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.pharmacyTransform = (obj) => {
  console.log('pharmacy transform', obj);
  //Rename fields
  obj.address.id = obj.address._id;
  obj.id = obj._id;
  // console.log('obj.hours', obj.hours);
  obj.hours = obj.hours.map((h) => {
    h.id = h._id;
    delete h._id;
    return h;
  });
  // console.log('obj.hours', obj.hours);
  delete obj._id;
  delete obj.address._id;

  return obj;
};
