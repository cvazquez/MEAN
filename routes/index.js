var express = require('express');
var router = express.Router();

var app = express();
var mongodb = require('../mongodb');
var assert = require('assert');
var http = require('http');
var os = require("os");

if (os.hostname() != "webdev1"){
  app.set('env', "production");
}


// Init sections to use in different routes
var sections = [
        { name: "Stocks",
          description: "Retrieve stock quotes from a 3rd party API call",
          link: "/stocks"
        },
        { name: "Running - Coming Soon",
          description: "Retrieve history of running mileage.",
          link: "/fitness/running"
        },
        {
          name: "Turing Omnibus - Coming Soon",
          description: "Work out examples in Turning Omnibus book.",
          link: "/turing-omnibus"
        },
        {
          name: "Algorithms - Coming Soon",
          description: "Work out examples in Computer Science Algorithm books.",
          link: "/algorithms"
        }
      ];





// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run first!");
  next();
});




//ejs
router.get('/', function(req, res, next) {
  //portfolio = require('../controllers/portfolio');

  // TODO - Move these into mongoDB
  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s Node.js Portfolio';
  page.introduction = "As a demo, I have created 4 different ways of displaying the list of potential sections for this portfolio site. For each example, the portfolio is stored in an object, which I display below.\
   One of them is retrieved from a MongoDB collection.";
  page.sectionsCode = JSON.stringify(sections);
  page.h2 = 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular';
  page.h3 = 'Demo Applications';


  var timeInMs = Date.now();
  

   res.render('index', {

        page: page,
        sections: sections,
        timeInMs: timeInMs,
        age: 39,

        // Override `foo` helper only for this rendering.
        helpers: {
            foo: function () { return 'foo.'; }
        }
    });
});



// Insert the sections into a MONGODB collection (portfolio)
// http://192.168.11.14:3000/savesections
router.get('/savesections', function(req, res, next) {

  var showTitle =  true;
  var title = 'Carlos Vazquez\'s Node.js Portfolio - Save Sections to MongoDB';

  var sectionCollection = {count: '[Empty Count]', results: '[Empty Results]'};

  
   var collection = mongodb.get().collection('sections');
    
   // remove sections from MongoDB sections collection
   collection.remove({}, function(err, result) {
      assert.equal(err, null);
      assert.equal(4, result.result.n);
      console.log("Removed " + result.result.n + " documents");
      //callback(result);
  });    

    // Reinsert sections into MongoDB collection
    collection.insert(sections, function(err, docs) {

      // http://mongodb.github.io/node-mongodb-native/2.0/
      assert.equal(err, null);
      assert.equal(4, docs.result.n);
      assert.equal(4, docs.ops.length);
      console.log("Inserted 4 documents into the document collection");
      //callback(result);
      
      collection.count(function(err, count) {

        console.log("count = " + count);
        sectionCollection["count"] = count;
        console.log("sectionCollection[count]: " + sectionCollection["count"]);
      });
 
      // Locate all the entries using find 
      collection.find().toArray(function(err, results) {
        console.dir(results);
        sectionCollection["results"] = results;

         var page = {};
          page.showTitle =  true;
          page.title = 'Carlos Vazquez\'s Node.js Portfolio - Save Sections';
          page.introduction = "Saving sections to MongoDB";
          page.sectionsCode = "";
          page.h2 = '';
          page.h3 = '';

        // Let's close the db 
        //mongodb.close();

          res.render('savesections', {
          showTitle: showTitle,
          title: title,
          sections: sections,
          sectionCollection: sectionCollection,
          page: page
          });  
      });


      

    });


});


// called from the home page, to demo retrieving the sections, as JSON, to Angular. Then Angular uses the JSON data to display the sections list
router.get('/angular/sections', function(req, res, next) {

  showTitle =  true;
  title = 'Carlos Vazquez\'s Node.js Portfolio';

  res.json(
      { title: title,
        h2: 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular',
        h3: 'Some Applications',
        sections: sections
    });  
});



// Stock Application
router.get('/stocks', function(req, res, next) {
  var sections = [
        { name: "Stock Calculations - todo",
          description: "Calculate Stock Stuff",
          link: "/stocks/algorithms"
        }
      ];

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s Node.js Portfolio - Stock Applications';
  page.introduction = "I use Angular to listen to a submit of the stock symbol field. Angular then makes an http call to a stock API I chose. The Stock API returns a JSONP response, and I use that callback to call a Javascript function that parses the Stock's name, symbol, exchange and price.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';


  res.render('stocks/index', {  
        page: page,
        sections: sections
  });
});


// Return JSON of existing clients that performed stock quotes
// /api/stocks/clientdata

router.get('/api/stocks/clientdata', function(req, res, next){

  
    var collection = mongodb.get().collection("stockClientData");
    var sort = {'_id': -1};
    var query = {};
    var limit = 10;

  
    // Locate all the entries using find, but exclude the primary key
    collection.find(query,{_id:false}).sort(sort).limit(limit).toArray(function(err, results) {
        // Return back to stock app, to use in the stock history sections
        res.json(results);
    });


});


// /api/clientdata/55.36/IBM
router.get('/api/clientdata/:stockPrice/:stockSymbol', function(req, res, next){
  var clientData = {};
  var errorMessage;
  var stock = {};
  stock.price = parseFloat(req.params.stockPrice);
  stock.symbol = req.params.stockSymbol.toUpperCase();


  // Validate that the stock number passed is a valid number. Return an error otherwise
  if (typeof stock.price != "number") {
      errorMessage = "Stock Price " + stock.price + " is not a valid number!";
      console.log(errorMessage);
      res.json({errorMessage: errorMessage});
  }


  // Validate that the stock symbol passed is valid
  console.log("stock test " + (/^[a-zA-Z0-9-]{1,5}$/i).test(stock.symbol));

  if (! (/^[a-zA-Z0-9-]{1,5}$/i).test(stock.symbol) ){
      errorMessage = "The stock symbol " + stock.symbol + " is not valid!";
      console.log(errorMessage);
      res.json({errorMessage: errorMessage});
      return;
  }


  clientData.stockPrice = stock.price;
  clientData.stockSymbol = stock.symbol;
  clientData.ipAddress = req.ip;
  clientData.userAgent = req.headers['user-agent'];
  clientData.countryCode = "";
  clientData.countryName = "";
  clientData.regionName = "";
  clientData.cityName = "";
  clientData.zipCode = "";
  clientData.latitude = "";
  clientData.longitude = "";
  clientData.timeZone = "";

  // I have to do this on dev, otherwise it passes my private IP
  if(app.get("env") === "development") {
    clientData.ipAddress = "74.125.45.100";
  }

  


  // Use this ip location api to determine location meta data about the current user
  // http://www.ipinfodb.com/ip_location_api.php
  // http://api.ipinfodb.com/v3/ip-city/?key=1b4cba9bd9a0825d02e1c3a7ed603af2e7517feb681140f2dea0be6db7371840&ip=72.229.208.82&format=json
  /* Example of the JSON that will return
  {
    "statusCode" : "OK",
    "statusMessage" : "",
    "ipAddress" : "74.125.45.100",
    "countryCode" : "US",
    "countryName" : "UNITED STATES",
    "regionName" : "CALIFORNIA",
    "cityName" : "MOUNTAIN VIEW",
    "zipCode" : "94043",
    "latitude" : "37.3956",
    "longitude" : "-122.076",
    "timeZone" : "-08:00"
  }
  */


    // Create HTTP call parameters 
    var options = {
        host: 'api.ipinfodb.com',
        port: 80,
        path: "http://api.ipinfodb.com/v3/ip-city/?key=1b4cba9bd9a0825d02e1c3a7ed603af2e7517feb681140f2dea0be6db7371840&ip=" + clientData.ipAddress + "&format=json",
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Call IP Location API
    http.get(options, function(resp){
      resp.on('data', function(chunk){

        // Parse results into a JSON object and return to client
        var bodyParsed = JSON.parse(chunk);

        clientData.countryCode = bodyParsed.countryCode;
        clientData.countryName = bodyParsed.countryName;
        clientData.regionName = bodyParsed.regionName;
        clientData.cityName = bodyParsed.cityName;
        clientData.zipCode = bodyParsed.zipCode;
        clientData.latitude = bodyParsed.latitude;
        clientData.longitude = bodyParsed.longitude;
        clientData.timeZone = bodyParsed.timeZone;

        var collection = mongodb.get().collection("stockClientData");
  

        // Insert clientData into MongoDB collection. This will display as a history of stock searches on the Stock Application
        collection.insert(clientData, function(err, docs) {

            // http://mongodb.github.io/node-mongodb-native/2.0/
            assert.equal(err, null);
            assert.equal(1, docs.result.n);
            assert.equal(1, docs.ops.length);
            console.log("Inserted 1 documents into the stockClientData collection");
            //callback(result);
          });
                
          collection.count(function(err, count) {
            console.log("count = " + count);
          });


          var sort = {'_id': -1};
          var query = {};
          var selector = {_id:false};
          var limit = 10;
           
          // Locate all the entries using find, but exclude the primary key
          collection.find(query,selector).sort(sort).limit(limit).toArray(function(err, results) {
              // Return back to stock app, to use in the stock history sections
              res.json(results);
          });



        //res.json(clientData);

      });
    }).on("error", function(e){
      // Return an empty  object 

      console.log("Got error: " + e.message);
      console.log(e);
    });



    /* // Using an alternate method through the request module
    var request = require("request");
     
    request("http://api.ipinfodb.com/v3/ip-city/?key=1b4cba9bd9a0825d02e1c3a7ed603af2e7517feb681140f2dea0be6db7371840&ip=" + clientData.ipAddress + "&format=json", function(error, response, body) {
      console.log(body);

      var bodyParsed = JSON.parse(body);

      clientData.countryCode = bodyParsed.countryCode;
      clientData.countryName = bodyParsed.countryName;
      clientData.regionName = bodyParsed.regionName;
      clientData.cityName = bodyParsed.cityName;
      clientData.zipCode = bodyParsed.zipCode;
      clientData.latitude = bodyParsed.latitude;
      clientData.longitude = bodyParsed.longitude;
      clientData.timeZone = bodyParsed.timeZone;

      console.log(clientData);

      res.json(clientData);

    });*/

  

});


router.get('/fitness/running', function(req, res, next) {


  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Running Applications';
  page.introduction = "Future Project: My plan is to call the MapMyRun API and display my running history here.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';

  res.render('fitness/running', { page: page, layout: true });
});





router.get('/turing-omnibus', function(req, res, next) {

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Turing Omnibus';
  page.introduction = "Future Project: My plan is to work out examples from this book.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';

  res.render('turing-omnibus', { page : page });
});


router.get('/algorithms', function(req, res, next) {

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Algorithms';
  page.introduction = "Future Project: My plan is to work out algorithm examples from my Computer Science books.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';

  res.render('algorithms', { page: page });
});

router.get('/locals', function(req, res, next) {
  res.render('index', { title: app.get('env') });
});



// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run if no route exists!");
  next();
});


/* Examples
router.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// handler for /user/:id which prints the user id
router.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});
*/

module.exports = router;