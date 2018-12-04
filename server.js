"use strict";
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const app = express();
const session = require("express-session");
const port = 3000;

var mongoose = require("mongoose");

//PASSPORT CONFIG
require("./config/passport")(passport);

// DB CONFIG
const dbase = require("./config/keys").mongoUri;

//CONNECT TO MOGODB
mongoose
  .connect(
    dbase,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("MONGODB Connected");
  })
  .catch(error => {
    console.log(error);
  });

//EXPRESS SESSION MIDDLEWARE
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// CONNECT FLASH MIDDLEWARE
app.use(flash());

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARIBLES
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user || null;
  console.log(req.user);

  next();
});

var request = require("request");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
module.exports = app;

var Stock = require("./models/Stock");
var Favourites = require("./models/FavStock");

//LOAD ROUTES
const index = require("./routes/index");
const apiCharts = require("./routes/api/charts");
const apiSearch = require("./routes/api/search");
const apiStock = require("./routes/api/stock");
const apiNews = require("./routes/api/news");
const apiMarkets = require("./routes/api/markets");

// USE ROUTES
app.use("/", index);
app.use("/api/charts", apiCharts);
app.use("/api/search", apiSearch);
app.use("/api/stock", apiStock);
app.use("/api/news", apiNews);
app.use("/api/markets", apiMarkets);

// var session = "";
var company = {};

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// @route   GET api/posts
// @desc    Get news articles for entire market
// @access  Public

/* show news on market */
app.get("/news", (req, res) => {
  res.render("news", { title: "news", query: {} });
  console.log("loading news");
});

app.get("/api/markets", function(req, res) {
  res.render("markets");
});

app.get("/api/history", (req, res) => {
  Stock.find({}, function(err, stocks) {
    if (err) {
      console.log(err);
      res.render("error", {});
    } else {
      res.render("history", { stocks: stocks });
    }
  });
});

// app.get("/stock/new/:Symbol", (req, res) => {
//   Stock.findOne({ symbol: req.params.Symbol }, function(err, stocks) {
//     if (err) {
//       console.log(err);
//       res.render("error", {});
//     } else {
//       console.log(stocks);
//       if (stocks === null) {
//         res.render("error", { message: "Not found" });
//       } else {
//         // res.status(200).send(book)
//         // res.render('index', { stocks: stocks})
//         var fav = new Favourites(stocks);
//         fav.save(function(err) {
//           if (err) {
//             throw err;
//           } else {
//             console.log(jsonBody);
//             res.render("index", { stocks: stocks });
//           }
//         });
//       }
//     }
//   });
// });

// app.get("/stock/:symbol", (req, res) => {
//   var query = {
//     symbol: req.params.symbol
//   };

//   var options = {
//     url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     qs: query
//   };

//   request(options, function(err, request, body) {
//     // markitondemand return status 200 whether if found stock or not
//     // if it found stock there will not be a message field
//     // if found stock then and only then save data to MongoDB
//     console.log("inside");
//     var jsonBody = JSON.parse(body);
//     if (!jsonBody.Message) {
//       jsonBody.user = session;
//       var newStocks = new Stock(jsonBody);

//       newStocks.save(function(err) {
//         if (err) {
//           throw err;
//         } else {
//           console.log(jsonBody);
//           res.render("landingpage", { company: newStocks });
//         }
//       });
//       //  res.render('landingpage',{company:newStocks})
//     }
//   });
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
