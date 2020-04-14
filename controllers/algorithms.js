var express = require('express'),
    router = express.Router(),
    mongodb = require('../mongodb');

  router.get('/', function(req, res, next) {
    var page = {
      showTitle     : true,
      title         : 'Carlos Vazquez\'s MEAN Portfolio - Algorithms',
      introduction  : "Future Project: My plan is to work out algorithm examples from my Computer Science books.",
      sectionsCode  : "",
      h2            : '',
      h3            : ''
    };

    res.render('algorithms/index', { page: page });
  });

module.exports = router;