var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');



router.get('/', function(req, res, next) {

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Algorithms';
  page.introduction = "Future Project: My plan is to work out algorithm examples from my Computer Science books.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';

  res.render('algorithms/index', { page: page });
});


module.exports = router;