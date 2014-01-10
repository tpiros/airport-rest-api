//appfog
if(process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb2-2.4.8'][0]['credentials']; 
    var host = mongo.hostname;
    var port = mongo.port;
    var db = mongo.db;
    var username = mongo.username;
    var password = mongo.password;
}
else {
    var host = 'localhost';
    var port = 27017;
    var username;
    var password ;
    var db = 'servicenow';
}
var mongodb = require('mongodb');
module.exports.init = function (cb) {
  var server = new mongodb.Server(host, port);
  new mongodb.Db(db, server, {w: 0}).open(function (error, client) {
    if(process.env.VCAP_SERVICES) {
      client.authenticate(username, password, function(err, res) {
        if(!err) {
            console.log("Authenticated");
        } else {
            console.log("Error in authentication.");
            console.log(err);
         }
        });
    }
    module.exports.client = client;
    module.exports.collection = new mongodb.Collection(client, 'airports');
    cb(error);
  });
};