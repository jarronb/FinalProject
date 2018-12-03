const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var lookupSchema = new Schema({
  Name: String,
  Symbol: String,
  Exchange: String
});

let companyLookUp = mongoose.model("company", lookupSchema);

module.exports = companyLookUp;
