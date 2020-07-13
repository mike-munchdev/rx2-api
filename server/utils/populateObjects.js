module.exports.cartPopulateObject = {
  path: 'cart',
  // Get rx of cart - populate the 'rx' array for every friend
  populate: {
    path: 'rx',
    model: 'Rx',
    populate: {
      path: 'drug',
      model: 'Drug',
      select: 'brand_name labeler_name generic_name',
    },
  },
};

module.exports.addressPopulateObject = {
  path: 'address',
};

module.exports.settingsPopulateObject = {
  path: 'settings',
  // select: '-_id',
  // Get rx of cart - populate the 'rx' array for every friend
};
