var express = require('express');


var MongoClient = require('mongodb').MongoClient;

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongo = process.env.VCAP_SERVICES;
var port = process.env.PORT || 3001;
var conn_str = "";

if (mongo) {
  console.log('i am in the cloud');
  console.log(mongo);
  var env = JSON.parse(mongo);
  if (env['mongodb']) {
    mongo = env['mongodb'][0]['credentials'];
    if (mongo.url) {
      conn_str = mongo.url;
    } else {
      console.log("No mongo found");
    }
  } else {
    conn_str = 'mongodb://localhost:27017';
  }
} else {
  console.log('I am running locally');
  conn_str = 'mongodb://localhost:27017';
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/world', function(req, res) {


  // MongoClient.connect(conn_str, function(err, db) {
  //
  //   var message = {"msg": "testing auto deploy"};
  //   if (db && db !== "null" && db !== "undefined") {
  //
  //     db.collection('messages').insert(message, {safe:true}, function(err){
  //       if (err) {
  //         console.log(err.stack);
  //         res.write('mongodb message insert failed');
  //         res.end();
  //       } else {
  //         res.write('following messages has been inserted into database' + "\n"
  //             + JSON.stringify(message));
  //         res.end();
  //       }
  //     });
  //   } else {
  //     res.write('No mongo found');
  //     res.end();
  //   }
  //
  //   if(err){
  //     console.log(err);
  //   }
  //
  // });

  //res.json({msg: "Hello World. My backend is deployed"});

  res.write('Hello World. My Backend is deployed');
  res.end();
});



app.get('/read', function(req, res) {

  var display = '';
  MongoClient.connect(conn_str, function(err, db) {


    if (db && db !== "null" && db !== "undefined") {

      var myDocs = db.collection('messages').find();


      myDocs.forEach(function(e){
        console.log(e);
        display = display.concat(e.msg + "\n");
        console.log(display);

      });


      // console.log('read' + display);
      // res.write('read out ' + display);
      // res.end();
    } else {
      res.write('No mongo found');
      res.end();
    }

    if(err){
      console.log(err);
    }

  });
  res.write('read out ' + display);
  res.end();
  // res.json({msg: "Hello World. I am writing to database - "});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
    error: {}
  });
});


module.exports = app;

app.listen(port);
