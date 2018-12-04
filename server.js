"use strict";
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3000;

var mongoose = require("mongoose");

const { ensureAuthenticated } = require("./helpers/auth");

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

app.get("/api/history", ensureAuthenticated, (req, res) => {
  Stock.find({ user: req.user }, function(err, stocks) {
    console.log(stocks);

    if (err) {
      console.log("error");
      // res.render("error", {});
      return;
    } else {
      res.render("history", { stocks: stocks });
    }
  });
});

app.get("/stock/new/:Symbol", ensureAuthenticated, (req, res) => {
  Stock.findOne({ symbol: req.params.Symbol }, function(err, stocks) {
    if (err) {
      console.log(err);
      res.render("error", {});
    } else {
      if (stocks === null) {
        res.render("error", { message: "Not found" });
      } else {
        // res.status(200).send(book)
        // res.render('index', { stocks: stocks})
        var fav = new Favourites(stocks);
        fav.save(function(err) {
          if (err) {
            throw err;
          } else {
            console.log(jsonBody);
            res.render("index", { stocks: stocks });
          }
        });
      }
    }
  });
});

let server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const stop = () => {
  server.close();
};

module.exports.stop = stop;
