const { pharmacyTransform } = require('./pharmacies');

module.exports.createCustomerResponse = ({
  ok,
  customer = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    customer: customer,
    error,
  };
};

module.exports.createGeneralResponse = ({
  ok,
  message = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    message,
    error,
  };
};

module.exports.createTokenResponse = ({
  ok,
  token = null,
  customer = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    token,
    customer,
    error,
  };
};
module.exports.createRxResponse = ({ ok, rx = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    rx: rx ? rx.transform() : rx,
    error,
  };
};
module.exports.createDoctorResponse = ({ ok, doctor = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    doctor: doctor.transform(),
    error,
  };
};
module.exports.createRxsResponse = ({ ok, rxs = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    rxs,
    error,
  };
};

module.exports.createPharmacyResponse = ({
  ok,
  pharmacy = null,
  error = null,
}) => ({
  ok,
  pharmacy: pharmacy,
  error,
});

module.exports.createPharmaciesResponse = ({
  ok,
  pharmacies = null,
  error = null,
}) => {
  return {
    ok,
    pharmacies:
      pharmacies && pharmacies.length > 0
        ? pharmacies.map((p) => pharmacyTransform(p))
        : [],
    error,
  };
};
