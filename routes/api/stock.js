const express = require("express");
const router = express.Router();

var Stock = require("../../models/Stock");

var request = require("request");

var session = "";

/* view the financial reports for a particular company */
/* with parameters for searching different ranges */
router.get("/financials", (req, res) => {
  res.render("Financials", { title: "financials", query: {} });
  console.log("rendering full page financials");
});

/* show market stats for certain ranges */
router.get("/market", (req, res) => {
  res.render("markets", { title: "market", query: {} });
  console.log("rendering market stats");
});

router.get("/", (req, res) => {
  res.render("find-stock", { title: "Find Stock", company: {} });
  console.log(req.body.id);
});

router.post("/", function(req, res) {
  var query = {
    symbol: req.body.id
  };

  var options = {
    url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    qs: query
  };

  request(options, function(err, request, body) {
    // markitondemand return status 200 whether if found stock or not
    // if it found stock there will not be a message field
    // if found stock then and only then save data to MongoDB
    var jsonBody = JSON.parse(body);
    console.log(jsonBody);

    jsonBody.user = session;
    if (!jsonBody.Message) {
      var newStocks = new Stock(jsonBody);

      newStocks.save(function(err) {
        if (err) {
          throw err;
        } else {
          console.log(jsonBody);
          res.render("landingpage", { company: newStocks });
        }
      });
      //   res.render('landingpage',{company:newStocks})
    }
  });
});

module.exports = router;
