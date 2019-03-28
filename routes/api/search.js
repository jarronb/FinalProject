const express = require('express');
const router = express.Router();

var request = require('request');

var Company = require('../../models/LookUpSchema');

// Load Models
var Stock = require('../../models/Stock');
var Favourites = require('../../models/FavStock');

// Route: api/search

const { ensureAuthenticated } = require('../../helpers/auth');

/* search functions */
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { title: 'Search', query: {} });
});

/* show news for a single market */
router.post('/company/news', function(req, res) {
  var query = {
    input: req.body.id
  };

  var thisCompany = req.body.id;

  var options = {
    url:
      'https://api.iextrading.com/1.0/stock/' + thisCompany + '/news/last/20',
    method: 'GET'
  };

  request(options, function(err, request, body) {
    var jsonBody = JSON.parse(body);

    var articles = jsonBody.map(function(data) {
      return new Article(data);
    });

    res.render('news', { Article: articles });
  });
});

// @route   GET /api/search/stock
// @desc    Display search view
//@view     search-stock
// @access  Public
router.get('/stock', ensureAuthenticated, (req, res) => {
  res.render('search-stock', { title: 'Search Stock', query: {} });
});

router.get('/stock/:symbol', (req, res) => {
  var query = {
    symbol: req.params.symbol
  };

  var options = {
    url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    qs: query
  };

  request(options, function(err, request, body) {
    // markitondemand return status 200 whether if found stock or not
    // if it found stock there will not be a message field
    // if found stock then and only then save data to MongoDB
    var jsonBody = JSON.parse(body);
    if (!jsonBody.Message) {
      var newStock = new Stock(jsonBody);
      newStock.user = req.user;
      newStock.save(err, (newStock) => {
        if (err) {
          throw err;
        } else {
          res.render('landingpage', { company: newStock });
        }
      });
      //  res.render('landingpage',{company:newStocks})
    }
  });
});

router.post('/stock', function(req, res) {
  var query = {
    input: req.body.id
  };

  var options = {
    url: 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    qs: query
  };

  request(options, function(err, request, body) {
    // markitondemand return status 200 whether if found stock or not
    // if it found stock there will not be a message field
    // if found stock then and only then save data to MongoDB
    var jsonBody = JSON.parse(body);
    if (!jsonBody.Message) {
      var lookupInfo = new Company(jsonBody);

      if (jsonBody.length === 0) {
        req.flash('error', 'Company not found!');
        return res.redirect('/api/search/stock');
      }

      lookupInfo.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.render('lookup-detail', { query: jsonBody });
        }
      });
      //remove next line and uncomment above
      //res.render('lookup-detail',{query:jsonBody})
    }
  });
});

module.exports = router;
