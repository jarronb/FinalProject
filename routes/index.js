const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var session = "";
var company = {};
var User = require("../models/User");
var Favourites = require("../models/FavStock");

router.get("/", (req, res) => {
  if (session === "") {
    res.render("login", { user: {} });
  } else {
    res.render("index", { title: "Welcome " + session, stocks: company });
  }
  console.log(session);
  console.log(req.body);
  res.render("index", { stocks: company });
});

// Sign up route
router.get("/signup", (req, res) => {
  res.render("register", {});
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

  // User.findOne({ Email: req.body.email, Password: req.body.password }, function(
  //   err,
  //   login
  // ) {
  //   if (err) {
  //     console.log(err);
  //     res.render("error", {});
  //   } else {
  //     if (login === null) {
  //       res.render("error", { message: "Username or password incorrect" });
  //     } else {
  //       Favourites.find({}, function(err, stocks) {
  //         if (err) {
  //           console.log(err);
  //           res.render("error", {});
  //         } else {
  //           session = login.Name;
  //           res.render("index", {
  //             title: "Welcome " + login.Name,
  //             stocks: stocks
  //           });
  //         }
  //       });
  //     }
  //   }
  // });
});

// Log out route
router.get("/logout", (req, res) => {
  session = "";
  res.render("login", { user: {} });
});

// Log in route
router.get("/login", (req, res) => {
  session = "";
  res.render("login", { user: {} });
});

router.get("/home", (req, res) => {
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
