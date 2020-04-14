var express = require('express'),
    router = express.Router(),
    app = express(),
    mongodb = require('../mongodb'),
    assert = require('assert'),
    http = require('http'),
    os = require("os");

// Init sections to use in different routes
app.get('env') === "development" && console.log("Inside Index.js");

// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run first (index)!");
  next();
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
        h2: 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular...',
        h3: 'Some Applications',
        sections: sections
    });
});


// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run if no route exists!");
  next();
});

module.exports = router;