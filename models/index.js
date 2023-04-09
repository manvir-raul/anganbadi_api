const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

db.inhabitant = require("./inhabitant.model");
db.family = require("./family.model");

db.ROLES = ["worker", "helper", "admin"];

module.exports = db;
