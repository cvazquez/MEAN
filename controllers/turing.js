var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');

router.get('/', function(req, res, next) {
  var page = {
    showTitle     : true,
    title         : 'Carlos Vazquez\'s MEAN Portfolio - Turing Omnibus',
    introduction  : 'Future Project: My plan is to work out examples from this book.',
    sectionsCode  : "",
    h2            : '',
    h3            : ''
  };

  res.render('turing/index', { page : page });
});

module.exports = router;