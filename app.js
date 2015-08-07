var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  partials = require('express-partials'),
  MongoClient = require('mongodb').MongoClient,
  format = require('util').format,
  assert = require('assert'),
  routes = require('./routes/index'),
  app = express(),
  helpers = require('express-helpers')(app),
  mongodb = require('./mongodb'),
  debug = require('express-debug'),
  os = require("os"),
  url = require('url');

//  users = require('./routes/users'),

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);


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
});


// If this hostname isn't webdev, then assume it is a production evironment
console.log("os.hostname(); = " + os.hostname());
if (os.hostname() != "webdev1"){
  app.set('env', "production");
}
console.log("Environment: " + app.get('env'));

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  // Only show debug screen on development
  debug(app, {}); 

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

  var page = {};
  page.showTitle =  true;
  page.title = 'Carlos Vazquez\'s MEAN Portfolio - Error Page';

  res.render('error', {
    page: page,

    message: err.message,
    err: err,
    error: {}
  });
});



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