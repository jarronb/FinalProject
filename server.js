'use strict';
const express = require('express')
const app = express()
const port = 3000

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stock');
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

var request = require('request');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
module.exports = app;

var stockSchema = new mongoose.Schema({
    Name:               String,
    Symbol:             String,
    LastPrice:          Number,
    Change:             Number,
    ChangePercent:      Number,
    MarketCap:          Number,
    Volume:             Number,
    ChangeYTD:          Number,
    ChangePercentYTD:   Number,
    High:               Number,
    Low:                Number,
    Open:               Number,
    DateCreated:       {
        type:       Date,
        default:    Date.now
    }
});
var favSchema = new mongoose.Schema({
    Name:               String,
    Symbol:             String,
    LastPrice:          Number,
    Change:             Number,
    ChangePercent:      Number,
    MarketCap:          Number,
    Volume:             Number,
    ChangeYTD:          Number,
    ChangePercentYTD:   Number,
    High:               Number,
    Low:                Number,
    Open:               Number,
    DateCreated:       {
        type:       Date,
        default:    Date.now
    }
});
var lookupSchema = new mongoose.Schema({
  Name:  String ,
  Symbol: String,
  Exchange: String
});

var marketNewsSchema = new mongoose.Schema({
  datetime: String,
  headline: String,
  source: String,
  url: String,
  summary: String,
  related: String,
  Image: String
});

var Stock = mongoose.model('Stock', stockSchema);
var Company = mongoose.model('Company',lookupSchema);
var Favourites = mongoose.model('Favourites', favSchema);
var Article = mongoose.model('MarketNews', marketNewsSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
app.get('/', (req, res) => {
  Favourites.find({}, function(err, stocks) {
    if (err) {
      console.log(err)
      res.render('error', {})
    } else {
      res.render('index', { stocks:  stocks })
    }
  });
  });
app.get('/stocks/new', (req, res) => {
    res.render('book-form', { title: "New Book", book: {} })
  });


    /* search functions */
    app.get('/search', (req, res) => {
      res.render('search', {title:"Search", query:{} });
      console.log("rendering search");
    });

    /* view the financial reports for a particular company */
    /* with parameters for searching different ranges */
    app.get('/stock/financials', (req, res) => {
      res.render('Financials', {title:"financials", query:{} });
      console.log("rendering full page financials");
    });

    /* show market stats for certain ranges */
    app.get('/stock/market', (req, res) => {
      res.render('market', {title:"market", query:{} });
      console.log("rendering market stats");
    });

    /* view all supported stock symbols by order of ___ */
    /* in order of gains in the past ___ */
    /* in order of dividends in the past ___ */
    /* in order of earnings in the past ____ */

    /* show news on market */
    app.get('/news', (req, res) => {
      res.render('news', {title:"news", query:{} });
      console.log("loading news");
    });

    app.get('/api/marketNews', function(req,  res) {
      var query = {
          'symbol': req.body.id
      };

      var options = {
          url: 'https://api.iextrading.com/1.0/stock/market/news/last/5',
          method: 'GET',
          qs: query
      };

      request(options, function(err, request, body) {
          var jsonBody = JSON.parse(body);
          var articles = jsonBody.map(function(data) {
            return new Article(data);
          });

          console.log(jsonBody.length);
          console.log(articles.length);

          console.log({Article:articles});

          res.render('news', {Article:articles});
      });
  });

app.post('/api/stock', function(req, res) {

       var query = {
           'symbol': req.body.id
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

               var newStocks = new Stock(jsonBody);

               newStocks.save(function(err) {
                   if (err) {
                       throw err;
                   } else{
                     console.log(jsonBody);
                     res.render('landingpage',{company:newStocks})
                   }
               });
            //   res.render('landingpage',{company:newStocks})
           }
       });
   });
   app.post('/api/lookup', function(req, res) {

          var query = {
              'input': req.body.id
          };

          var options = {
              url: 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              qs: query
          }

          request(options, function(err, request, body) {
              // markitondemand return status 200 whether if found stock or not
              // if it found stock there will not be a message field
              // if found stock then and only then save data to MongoDB
              var jsonBody = JSON.parse(body);
              if (!jsonBody.Message) {
                  console.log(jsonBody);
                  var lookupInfo = new Company(jsonBody);

                  lookupInfo.save(function(err) {
                      if (err) {
                          throw err;
                      } else{
                        console.log(jsonBody);
                       res.render('lookup-detail',{query:jsonBody})
                      }
                  });
                  //remove next line and uncomment above
                  //res.render('lookup-detail',{query:jsonBody})
              }
          });
      });
app.get('/api/stock', (req, res) => {
  res.render('find-stock', { title: "Find Stock", company: {} })
  console.log(req.body.id);

});
app.get('/api/history', (req, res) => {
  Stock.find({}, function(err, stocks) {
    if (err) {
      console.log(err)
      res.render('error', {})
    } else {
      res.render('history', { stocks:  stocks })
    }
  });
  });
app.get('/api/lookup', (req, res) => {
  res.render('look-up', { title: "Look Up", query: {} })
  console.log(req.body.id);

});

app.get('/stock/new/:Symbol', (req, res) => {


  Stock.findOne({"symbol": req.params.Symbol}, function(err, stocks) {
    if (err) {
      console.log(err)
      res.render('error', {})
    } else {
      console.log(stocks)
      if (stocks === null) {
        res.render('error', { message: "Not found" })
      } else {
       // res.status(200).send(book)
        // res.render('index', { stocks: stocks})
        var fav = new Favourites(stocks);
        fav.save(function(err) {
            if (err) {
                throw err;
            } else{
              console.log(jsonBody);
              res.render('index',{stocks:stocks})
            }
        });
      }
    }
  });
});
app.get('/stock/:symbol', (req, res) => {
  var query = {
      'symbol': req.params.symbol
  };

  var options = {
      url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      qs: query
  }

  request(options, function(err, request, body) {
      // markitondemand return status 200 whether if found stock or not
      // if it found stock there will not be a message field
      // if found stock then and only then save data to MongoDB
      console.log("inside");
      var jsonBody = JSON.parse(body);
      if (!jsonBody.Message) {

          var newStocks = new Stock(jsonBody);

          newStocks.save(function(err) {
              if (err) {
                  throw err;
              } else{
                console.log(jsonBody);
                res.render('landingpage',{company:newStocks})
              }
          });
        //  res.render('landingpage',{company:newStocks})
      }
  });

});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
