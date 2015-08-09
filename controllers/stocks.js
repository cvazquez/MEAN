var express = require('express'),
    router = express.Router(),
    app = express(),
    mongodb = require('../mongodb'),
    http = require('http'),
    assert = require('assert'),
    os = require("os");

if (os.hostname() != "webdev1"){
  app.set('env', "production");
}

console.log("/stocks");

// Stock Application
router.get('/', function(req, res, next) {
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



// /api/clientdata/55.36/IBM
router.get('/api/clientdata/:stockPrice/:stockSymbol', function(req, res, next){
  var clientData = {};
  var errorMessage;
  var ipInfoDBKey;
  var apikeyCollection;
  var stock = {};
  stock.price = parseFloat(req.params.stockPrice);
  stock.symbol = req.params.stockSymbol.toUpperCase();

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


  // I have to do this on dev, otherwise it passes my private IP
  console.log("Environment: ", app.get("env"));
  if(app.get("env") === "development") {
    clientData.ipAddress = "74.125.45.100";
  }

  
    // Create HTTP call parameters 
    // > db.apikeys.insert({name: "ipinfodb", key: [YourAPIKEY]});

/*
    // Get the api key for ipinfodb.com
    apikeyCollection = mongodb.get().collection("apikeys");
    //db.apikeys.find({name:"ipinfodb"},{_id:0,key:1});


    
    apikeyCollection.find({"name":"ipinfodb"},{"_id":0,"key":1}).limit(1).toArray(function(err, result) {
            if(err){
                  console.log(err); 
            } else{
                ipInfoDBKey = result[0].key;
                console.log("key = " + ipInfoDBKey);

            }
          }).on("error", function(e){
              // Return an empty  object 

              console.log("Got error: " + e.message);
              console.log(e);
            });
    */

    

    function ipDataResponse(){       

        if (ipInfoDBKey == "" || typeof ipInfoDBKey === "undefined"){
           ipInfoDBKey = "1b4cba9bd9a0825d02e1c3a7ed603af2e7517feb681140f2dea0be6db7371840";
        }

            // Use this ip location api to determine location meta data about the current user
            // http://www.ipinfodb.com/ip_location_api.php
            // http://api.ipinfodb.com/v3/ip-city/?key= + ipInfoDBKey + &ip=72.229.208.82&format=json
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



          var options = {
              host: 'api.ipinfodb.com',
              port: 80,
              path: "http://api.ipinfodb.com/v3/ip-city/?key=" + ipInfoDBKey + "&ip=" + clientData.ipAddress + "&format=json",
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
              collection.insert(clientData, function(err2, docs) {

                  if(err2){
                        console.log(err2); 
                  } else{

                    // http://mongodb.github.io/node-mongodb-native/2.0/
                    assert.equal(err2, null);
                    //assert.equal(1, docs.result.n);
                    assert.equal(1, docs.ops.length);
                    console.log("Inserted 1 documents into the stockClientData collection");
                    //callback(result);
                  }
                });
                      
                collection.count(function(err3, count) {
                  console.log("count = " + count);
                });


                var sort = {'_id': -1};
                var query = {};
                var selector = {_id:false};
                var limit = 10;
                 
                // Locate all the entries using find, but exclude the primary key
                collection.find(query,selector).sort(sort).limit(limit).toArray(function(err4, results) {
                    // Return back to stock app, to use in the stock history sections

                    if(err4){
                      console.log(err4); 
                    } else{
                      res.json(results);
                    }
                    
                });

                //res.json(clientData);

              });
            }).on("error", function(e2){
              // Return an empty  object 

              console.log("Got error: " + e2.message);
              console.log(e2);
            });
      }

  ipDataResponse();

    /* // Using an alternate method through the request module
    var request = require("request");
     
    request("http://api.ipinfodb.com/v3/ip-city/?key=" + key + "&ip=" + clientData.ipAddress + "&format=json", function(error, response, body) {
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




// Return JSON of existing clients that performed stock quotes
// /api/stocks/clientdata

router.get('/api/clientdata', function(req, res, next){

  
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


module.exports = router;