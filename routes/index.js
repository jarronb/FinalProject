const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var session = "";
var company = {};
var User = require("../models/User");
var Favourites = require("../models/FavStock");

const { ensureAuthenticated } = require("../helpers/auth");

router.get("/", (req, res) => {
  console.log(typeof req.user);

  if (req.user) {
    res.redirect("./home");
  } else {
    req.flash("error", "Please login");
    res.redirect("./login");
  }
});

// Sign up route
router.get("/signup", (req, res) => {
  res.render("register", {
    user: {
      Name: false
    }
  });
});

// Register route
router.post("/register", (req, res) => {
  //res.render('index', {})
  console.log(req.body);

  var newUser = new User(req.body);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.Password, salt, (err, hash) => {
      if (err) throw err;
      newUser.Password = hash;

      newUser.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.render("login", { user: req.body });
        }
      });
    });
  });
});

// Login route
router.post("/login", (req, res, next) => {
  console.log(req.body);

  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
  })(req, res, next);
});

// Log out route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("./login");
});

// Log in route
router.get("/login", (req, res) => {
  res.render("login", { user: {} });
});

router.get("/home", ensureAuthenticated, (req, res) => {
  Favourites.find({}, function(err, stocks) {
    if (err) {
      console.log(err);
      res.render("error", {});
    } else {
      res.render("index", { stocks: stocks });
    }
  });
});

module.exports = router;
