var express = require('express'),
    router = express.Router(),
    app = express(),
    mongodb = require('../mongodb'),
    assert = require('assert'),
    http = require('http'),
    os = require("os"),
    env = "dev",
    // Init sections to use in different routes
    sections = [
        { name: "Stocks",
          description: "Retrieve stock quotes from a 3rd party API call",
          link: "/stocks"
        },
        { name: "Fitness - Coming Soon",
          description: "Retrieve history of running mileage.",
          link: "/fitness"
        },
        {
          name: "Turing Omnibus - Coming Soon",
          description: "Work out examples in Turning Omnibus book.",
          link: "/turing"
        },
        {
          name: "Algorithms - Coming Soon",
          description: "Work out examples in Computer Science Algorithm books.",
          link: "/algorithms"
        }
      ];

app.get('env') === "development" && console.log("Inside Index.js");

// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware

  app.get('env') === "development" && console.log("This is always run first (home)!");

  next();
});

//ejs
router.get('/', function(req, res, next) {

  app.get('env') === "development" && console.log("Inside /");

  // TODO - Move these into mongoDB
  var page = {
    showTitle     :  true,
    title         : 'Carlos Vazquez\'s Node.js Portfolio',
    introduction  : "As a demo, I have created 4 different ways of displaying the list of potential sections for this portfolio site. For each example, the portfolio is stored in an object, which I display below.\
                    of them is retrieved from a MongoDB collection.",
    sectionsCode  : JSON.stringify(sections),
    h2            : 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular.',
    h3            : 'Demo Applications'
  },
  timeInMs = Date.now();

   res.render('home/index', {
        page      : page,
        sections  : sections,
        timeInMs  : timeInMs,
        age       : 39,

        // Override `foo` helper only for this rendering.
        helpers   : {
            foo: function () { return 'foo.'; }
        }
    });
});


// Insert the sections into a MONGODB collection (portfolio)
// http://192.168.11.14:3000/savesections
router.get('/savesections', function(req, res, next) {
  var showTitle =  true,
      title = 'Carlos Vazquez\'s Node.js Portfolio - Save Sections to MongoDB',
      sectionCollection = {count: '[Empty Count]', results: '[Empty Results]'},
      collection = mongodb.get().collection('sections');

   // remove sections from MongoDB sections collection
   collection.remove({}, function(err, result) {
      assert.equal(err, null);
      assert.equal(4, result.result.n);
      app.get('env') === "development" && console.log("Removed " + result.result.n + " documents");
    });

    // Reinsert sections into MongoDB collection
    collection.insert(sections, function(err, docs) {

      // http://mongodb.github.io/node-mongodb-native/2.0/
      assert.equal(err, null);
      assert.equal(4, docs.result.n);
      assert.equal(4, docs.ops.length);
      app.get('env') === "development" && console.log("Inserted 4 documents into the document collection");

      collection.count(function(err, count) {
        app.get('env') === "development" && console.log("count = " + count);
        sectionCollection["count"] = count;
        app.get('env') === "development" && console.log("sectionCollection[count]: " + sectionCollection["count"]);
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        var page = {
          showTitle     :  true,
          title         : 'Carlos Vazquez\'s Node.js Portfolio - Save Sections',
          introduction  : "Saving sections to MongoDB",
          sectionsCode  : "",
          h2            : '',
          h3            : ''
       };

        app.get('env') === "development" && console.dir(results);
        sectionCollection["results"] = results;

        res.render('savesections', {
          showTitle         : showTitle,
          title             : title,
          sections          : sections,
          sectionCollection : sectionCollection,
          page              : page
        });
      });
    });
});


// called from the home page, to demo retrieving the sections, as JSON, to Angular. Then Angular uses the JSON data to display the sections list
router.get('/angular/sections', function(req, res, next) {

  showTitle =  true;
  title = 'Carlos Vazquez\'s Node.js Portfolio';

  res.json(
      {
        title     : title,
        h2        : 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular..',
        h3        : 'Some Applications',
        sections  : sections
    });
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

module.exports = router;