module.exports.ERRORS = {
  CUSTOMER: {
    NOT_FOUND_WITH_PROVIDED_INFO:
      'No customer found with the provided information.',
    NOT_FOUND: 'No customer found.',
    EMAIL_AND_PASSWORD_INCORRECT:
      'Email and password combination is incorrect.',
    ACCOUNT_EMAIL_TAKEN: 'Email address already associated with an account.',
    RX_ALREADY_EXISTS_IN_CART: 'The Rx is already in your cart',
    RX_ALREADY_EXISTS_IN_QUEUE: 'The Rx is already in your queue',
    PUSH_TOKEN_ALREADY_EXISTS: 'Push Token already exists',
    ACCOUNT_NOT_ACTIVATED: 'Account not activated.',
    CONFIRM_TOKEN_NOT_FOUND: 'Confirm token not found.',
  },
  DOCTOR: {
    NOT_FOUND_WITH_PROVIDED_INFO:
      'No doctor found with the provided information.',
    NOT_FOUND: 'No doctor found.',
  },
  RX: {
    NOT_FOUND_WITH_PROVIDED_INFO: 'No Rx found with the provided information.',
    NOT_FOUND: 'No Rx found.',
    NO_MORE_REFILLS_ALLOWED: 'Maximum refills reached.',
  },
  AUTH: {
    DENIED: 'Access denied',
  },
};
