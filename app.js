var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var MongoClient = require('mongodb').MongoClient
  , format = require('util').format
  , assert = require('assert');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var helpers = require('express-helpers')(app);
var mongodb = require('./mongodb');


var debug = require('express-debug');
var os = require("os");
var url = require('url');

console.log("os.hostname(); = " + os.hostname());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 


app.locals.title = 'Carlos Vazquez\'s Node.js Portfolio';

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Connect to Mongo on start
mongodb.connect('mongodb://localhost:27017/portfolio', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo and porfolio document.');
    process.exit(1);
  } 
  /*
  else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }*/
});

// If this hostname isn't webdev, then assume it is a production evironment
if (os.hostname() != "webdev1"){
  app.set('env', "production");
}

console.log("Environment: " + app.get('env'));

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    err: err,
    error: {}
  });
});


if (os.hostname() === "webdev1"){
  debug(app, {});  
}


module.exports = app;


// Stuff I ended up not using

//var exphbs  = require('express-handlebars');
//var jQuery = require('jquery');
//global.jQuery = require('jquery');
//require('bootstrap');


/*var hbs = exphbs.create({ 
  // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; }
    }
});
*/

//var hbs = require('hbs');
//require('handlebars-form-helpers').register(hbs.handlebars);


//app.set('view engine', 'jade');

// basic way to register a Handlebars view engine
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');

// Register `hbs.engine` with the Express app.
//app.engine('handlebars', hbs.engine);
//app.set('view engine', 'handlebars');
//app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
//app.set('view engine', '.hbs');

//app.set('view options', { layout: 'main' });