const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  id_type: { type: String },
  password: { type: String, required: true },
  token: { type: String },
});

module.exports = mongoose.model("user", UserSchema);