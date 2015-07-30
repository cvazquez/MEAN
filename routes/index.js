var express = require('express');
var router = express.Router();

var app = express();
var mongodb = require('../mongodb');
var assert = require('assert');

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


router.param('id', function (req, res, next, id) {
  console.log('I catch all parameters called poo');
  next();
})


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
        // Let's close the db 
        //mongodb.close();

          res.render('savesections', {
          showTitle: showTitle,
          title: title,
          sections: sections,
          sectionCollection: sectionCollection
          });  
      });


      

    });


});


//ejs
router.get('/', function(req, res, next) {
  //portfolio = require('../controllers/portfolio');

  // TODO - Move these into mongoDB
  var showTitle =  true;
  var title = 'Carlos Vazquez\'s Node.js Portfolio';
  var introduction = "As a demo, I have created 4 different ways of displaying the list of potential sections for this portfolio site. For each example, the portfolio is stored in an object, which I display below.\
   One of them is retrieved from a MongoDB collection.";
  var sectionsCode = JSON.stringify(sections);


  var timeInMs = Date.now();
  

   res.render('index', {

        showTitle: showTitle,
        title: title,
        h2: 'Using Express, EJS, MongoDB, Bootstrap, BackBone and Angular',
        h3: 'Some Applications',
        introduction: introduction,
        sectionsCode: sectionsCode,

        sections: sections,
        timeInMs: timeInMs,
        age: 39,


        

        // Override `foo` helper only for this rendering.
        helpers: {
            foo: function () { return 'foo.'; }
        }
    });
});

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



/* GET Stocker Application. */
router.get('/stocks', function(req, res, next) {

  var sections = [
        { name: "Stock Calculations",
          description: "Calculate Stock Stuff",
          link: "/stocks/algorithms"
        }
      ];

  showTitle =  true;
  title = 'Stock Applications';

  res.render('stocks/index', { 
 
        title: title,
        sections: sections

  });
});

router.get('/stocks/algorithms', function(req, res, next) {


  showTitle =  true;
  title = 'Stock Application Algorithms';

  res.render('stocks/algorithms', { 
        layout: false,
        title: title,

  });
});

router.get('/fitness/running', function(req, res, next) {
  res.render('fitness/running', { title: 'Running Applications' });
});

router.get('/turing-omnibus', function(req, res, next) {
  res.render('turing-omnibus', { title: 'Turing Ombibus Applications' });
});


router.get('/algorithms', function(req, res, next) {
  res.render('algorithms', { 
  	layout: 'main',
  	title: 'Introduction to Computing and Algorithms Applications',
  	showTitle: true
  });
});

router.get('/locals', function(req, res, next) {
  res.render('index', { title: app.get('env') });
});


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


// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  console.log("This is always run if no route exists!");
  next();
});

module.exports = router;