var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');

// Stock Application
router.get('/', function(req, res, next) {
  var sections = [
        { name: "Stock Calculations - todo",
          description: "Calculate Stock Stuff",
          link: "/stocks/algorithms"
        }
      ],
      page = {
        showTitle     : true,
        title         : 'Carlos Vazquez\'s Node.js Portfolio - Fitness Applications',
        introduction  : '',
        sectionsCode  : "",
        h2            : '',
        h3            : ''
      };

  res.render('fitness/index', {
        page: page,
        sections: sections
  });
});

module.exports = router;