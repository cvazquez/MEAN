var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');



router.get('/', function(req, res, next) {

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Turing Omnibus';
  page.introduction = "Future Project: My plan is to work out examples from this book.";
  page.sectionsCode = "";
  page.h2 = '';
  page.h3 = '';

  res.render('turing/index', { page : page });
});


module.exports = router;