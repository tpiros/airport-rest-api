'use strict';

var express  = require('express');
var app      = express();
var router   = express.Router();
var routes   = require('./routes/api');
var dbconfig = require('./config/db');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || 'localhost');
app.set('jsonp callback', true);


dbconfig.init(function (error) {
  if (error)
    console.log(error);
});

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://null.jsbin.com');
  next();
});

router.route('/').get(routes.all);
router.route('/airport/:airporttype').get(routes.airportType);
router.route('/airport/iata/:iata').get(routes.airportIATA);
router.route('/airport/distance/:distance').get(routes.airportDistance);

app.use('/', router);

app.listen(app.get('port'), app.get('ipaddr'));

console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
