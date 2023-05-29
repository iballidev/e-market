const mongoose = require("mongoose");
const ROLE_LIST = require("../config/role-list");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  roles: {
    User: { type: Number, required: true, default: ROLE_LIST.User },
    Admin: Number,
    Editor: Number,
  },
  refreshToken: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
