var express = require('express')
, app = express()
, server = require('http').createServer(app)
, dbconfig = require('./config/db')
, api = require('./routes/api');

app.configure(function() {
  app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
  app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
  app.set("jsonp callback", true);
  app.use(express.bodyParser());
  app.use(app.router);
});

dbconfig.init(function (error) {
  if (error)
    console.log(error);
});

app.get('/', api.all);
app.get('/airport/:airporttype', api.airportType);
app.get('/airport/iata/:iata', api.airportIATA);
app.get('/airport/distance/:distance', api.airportDistance);
server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});