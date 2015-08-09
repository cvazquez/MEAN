var express = require('express');
var router = express.Router();

var app = express();
var mongodb = require('../mongodb');
var assert = require('assert');
var http = require('http');
var os = require("os");

// Init sections to use in different routes
console.log("Inside Index.js");


if (os.hostname() != "webdev1"){
  app.set('env', "production");
}


// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run first!");
  next();
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