var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');


var userRouter = require('./routes/user');
var authenticationRouter = require('./routes/authentication');
var courseRouter = require('./routes/course');
var examRouter = require('./routes/exam');
var gradeRouter = require('./routes/grade');
const submissionRouter = require('./routes/submission')
const Authentication = require('./models/Authentication')

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/authentication', authenticationRouter);
app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/exam', examRouter);
app.use('/grade', gradeRouter);
app.use('/submission', submissionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;