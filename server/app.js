require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Pool = require('pg').Pool;
const cors = require('cors');

const app = express();
const tasksRouter = require('./routes/tasks');
const pool = new Pool();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/tasks', tasksRouter(pool));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(res.status(404).json({
    statusCode: 404,
    message: 'not found'
  }));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    statusCode: 500,
    message: 'internal server error'
  });
});

module.exports = app;
