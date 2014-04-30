require('newrelic');
require('webkit-devtools-agent');

var express  = require('express')
,   cluster  = require('cluster')
,   cpus     = require('os').cpus().length
,   monk     = require('monk')('localhost/new_relic_leak')
,   data     = monk.get('data')
,   memwatch = require('memwatch')
,   _        = {}
,   app      = express();

memwatch.on('leak', function (data) {
  console.log('Memory Leak Detected: ');
  console.log(data);
});

data.insert({ number: Math.random() })
.on('success', function () {
  exports.boot();
});

_.load = function (req, res, next) {
  data.find({})
  .on('success', function (numbers) {
    req.numbers = numbers;
    next();
  })
  .on('error', function (err) {
    return next(err);
  });
}

app.set('views', './');
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  // Fake middleware, just to check the stack.
  next();
});

if (process.env.LOG) app.use(require('morgan')());

app.get('/', function (req, res) {
  res.render('index');
});

// Testing the middleware Router (express.Router).
app.route('/test')
  .get(function (req, res) {
    res.render('index')
  });

app.route('/db')
  .get(_.load)
  .get(function (req, res) {
    res.render('db', { numbers: req.numbers });
  });

app.route('/dbclean')
  .get(_.load)
  .get(function (req, res) {
    res.json(req.numbers);
  });

app.use(require('errorhandler')());

exports.boot = function () {
  if (process.env.CLUSTER && cluster.isMaster) {
    for (var i = 0; i < cpus; i++) { cluster.fork(); }
  } else {
    app.listen(9292);
  }
}
