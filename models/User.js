const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  Name: {
    type: String
  },
  Password: {
    type: String
  },
  Email: {
    type: String
  }
});

let User = mongoose.model("user", userSchema);

module.exports = User;
