var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require ('body-parser')
var logger = require('morgan');
var session = require('express-session');
var expressValidator = require ('express-validator');
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;
var multer = require ('multer');
var upload = multer ({dest:'./uploads'});
var flash = require ('connect-flash');
var bcrypt = require ('bcryptjs');
var mongo = require ('mongodb');
var mongoose = require ('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get the Javascript in the browser
// app.use("/javascripts", express.static(__dirname));
//add the manifest
app.get("/manifest.json", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/cache-manifest");
    //console.log(path.join(__dirname,"manifest.json"));
    //send the manifest file
    //to be parsed bt express
    res.sendFile(path.join(__dirname,"manifest.json"));
  });

//add the service worker
  app.get("/sw.js", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/javascript");

    res.sendFile(path.join(__dirname,"sw.js"));
  });

  app.get("/loader.js", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/javascript");

    res.sendFile(path.join(__dirname,"loader.js"));
  });



//handel session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave: true
}));

//passport authentication system
app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //  res.setHeader('Content-Type', 'text/plain')
  //  res.write('you posted:\n')
  //  res.end(JSON.stringify(req.body, null, 2))
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
