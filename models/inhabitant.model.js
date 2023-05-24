const mongoose = require("mongoose");
const { capitalizeFirstLetter } = require("../utils/commonutils");

const bank_details_schema = new mongoose.Schema({
  bank_name: String,
  bank_account_number: Number,
  bank_ifsc_code: String,
});

const childSchema = new mongoose.Schema({
  child: { type: mongoose.ObjectId, ref: "Inhabitant" },
});

const inhabitantSchema = new mongoose.Schema({
  children: [childSchema],
  bank_details: { type: bank_details_schema, default: () => ({}) },
  name: {
    type: String,
    get: capitalizeFirstLetter,
    required: true,
  },
  father_name: {
    type: mongoose.ObjectId,
    ref: "Inhabitant",
  },
  mother_name: {
    type: mongoose.ObjectId,
    ref: "Inhabitant",
  },
  spouse_name: {
    type: mongoose.ObjectId,
    ref: "Inhabitant",
  },
  gender: {
    type: Number,
    required: true,
  },
  adhar_card: Number,
  age: Number,
  caste: Number,
  date_of_birth: Date,
  is_pensioner: Boolean,
  marital_status: Boolean,
  pan_card: String,
  pension_number: String,
  pension_type: String,
  family_number: {
    type: Number,
    ref: "Family",
  },
});

const Inhabitant = mongoose.model("Inhabitant", inhabitantSchema);

module.exports = Inhabitant;
