const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketNewsSchema = new Schema({
  datetime: {
    type: String
  },
  headline: {
    type: String
  },
  source: {
    type: String
  },
  url: {
    type: String
  },
  summary: {
    type: String
  },
  related: {
    type: String
  },
  image: {
    type: String
  }
});

let marketNews = mongoose.model("marketNews", marketNewsSchema);

module.exports = marketNews;
