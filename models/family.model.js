const mongoose = require("mongoose");

const member = new mongoose.Schema({
  _id: { type: mongoose.ObjectId, ref: "Inhabitant" },
  relation_with_head: String,
});

const Family = mongoose.model(
  "family",
  new mongoose.Schema({
    _id: Number,
    family_head: { type: mongoose.ObjectId, ref: "Inhabitant" },
    members: {
      type: [member],
      default: undefined,
    },
  })
);

module.exports = Family;
