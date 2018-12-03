const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketCompanySchema = new Schema({
  symbol: {
    type: String
  },
  companyName: {
    type: String
  },
  exchangeMarket: {
    type: String
  },
  sector: {
    type: String
  },
  calcPrice: {
    type: String
  },
  open: {
    type: Number
  },
  openTime: {
    type: Number
  },
  close: {
    type: Number
  },
  closeTime: {
    type: Number
  },
  high: {
    type: Number
  },
  low: {
    type: Number
  },
  latestPrice: {
    type: Number
  },
  latestSource: {
    type: String
  },
  latestTime: {
    type: String
  },
  latestUpdate: {
    type: Number
  },
  latestVolume: {
    type: Number
  },
  iexRealTimePrice: {
    type: Boolean
  },
  iexRealTimeStatus: {
    type: Boolean
  },
  iexLastUpdated: {
    type: Boolean
  },
  delayedPrice: {
    type: Number
  },
  delayedPriceTime: {
    type: Number
  },
  extendedPrice: {
    type: Number
  },
  extendedChange: {
    type: Number
  },
  extendedChangePercent: {
    type: Number
  },
  extendedPriceTime: {
    type: Number
  },
  previousClose: {
    type: Number
  },
  change: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  iexMarketPercent: {
    type: Number
  },
  iexVolume: {
    type: Number
  },
  avgTotalVolume: {
    type: Number
  },
  iexBidPrice: {
    type: Boolean
  },
  iexBidSize: {
    type: Boolean
  },
  iexAskPrice: {
    type: Boolean
  },
  iexAskSize: {
    type: Boolean
  },
  marketCap: {
    type: Number
  },
  peRatio: {
    type: Boolean
  },
  week52High: {
    type: Number
  },
  week52Low: {
    type: Number
  },
  ytdChange: {
    type: Number
  }
});

let marketCompany = mongoose.model("marketCompany", marketCompanySchema);

module.exports = marketCompany;
