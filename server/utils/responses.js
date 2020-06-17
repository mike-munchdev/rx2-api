module.exports.createCustomerResponse = ({
  ok,
  customer = null,
  error = null,
}) => ({
  ok,
  customer,
  error,
});

module.exports.createGeneralResponse = ({
  ok,
  message = null,
  error = null,
}) => ({
  ok,
  message,
  error,
});
