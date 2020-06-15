const mongoose = require('mongoose');
const { default: validatorF } = require('validator');

const DrugSchema = new mongoose.Schema({
  marketing_start_date: { type: String },
  marketing_end_date: { type: String },
  product_type: { type: String },
  product_id: { type: String },
  marketing_category: { type: String },
  route: [String],
  generic_name: { type: String },
  openfda: {
    spl_set_id: [String],
    is_original_packager: [Boolean],
    manufacturer_name: [String],
    unii: [String],
    rxcui: [String],
    upc: [String],
  },
  brand_name: { type: String },
  brand_name_base: { type: String },
  labeler_name: { type: String },
  packaging: [
    {
      marketing_start_date: String,
      sample: Boolean,
      marketing_end_date: String,
      description: String,
      package_ndc: String,
    },
  ],
  active_ingredients: [
    {
      strength: String,
      name: String,
    },
  ],
  product_ndc: String,
  finished: Boolean,
  spl_id: String,
  pharm_class: [String],
  application_number: String,
  listing_expiration_date: String,
  dosage_form: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drug', DrugSchema);
