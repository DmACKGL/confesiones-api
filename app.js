var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql= require('mysql');
var http = require('http');
var RateLimit = require('express-rate-limit');
const auth = require('http-auth');
const basic = auth.basic({realm: 'Area Monitoreo'}, function(user, pass, callback) {
  callback(user === 'confesiones' && pass === '####');
});

var index = require('./routes/index');
var confesiones = require('./routes/confesiones');

var app = express();

// Rates
app.enable('trust proxy');

const statusMonitor = require('express-status-monitor')({ path: '' });
app.use(statusMonitor.middleware);
app.get('/status', auth.connect(basic), statusMonitor.pageRoute);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	global.connection = mysql.createConnection({
	  	host     : '138.122.227.11',
	  	user     : 'replica',
			password : '',
  		database : 'confesiones'
	});
	connection.connect();
	next();
});

app.use('/', index);
app.use('/api/v1/confesiones', confesiones);

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var server = http.createServer(app);
server.listen(4001);
