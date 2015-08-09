var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');

console.log("Top of fitness");


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
  page.title = 'Carlos Vazquez\'s Node.js Portfolio - Fitness Applications';
  page.introduction = "";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';


  res.render('fitness/index', {  
        page: page,
        sections: sections
  });
});


module.exports = router;