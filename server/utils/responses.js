module.exports.createCustomerResponse = ({
  ok,
  customer = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    customer,
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

module.exports.createTokenResponse = ({ ok, token = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    token,
    error,
  };
};
module.exports.createRxResponse = ({ ok, rx = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    rx,
    error,
  };
};
module.exports.createDoctorResponse = ({ ok, doctor = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    doctor,
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
