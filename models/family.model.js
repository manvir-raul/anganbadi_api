const mongoose = require("mongoose");

const member = new mongoose.Schema({
  member: { type: mongoose.ObjectId, ref: "Inhabitant" },
  relation_with_head: String,
});

const Family = mongoose.model(
  "family",
  new mongoose.Schema({
    id: Number,
    members: [member],
  })
);

module.exports = Family;
