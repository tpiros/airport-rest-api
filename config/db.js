//openshift
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    //var mongo = env['mongodb2-2.4.8'][0]['credentials'];
    var host = process.env.OPENSHIFT_MONGODB_DB_HOST;
    var port = process.env.OPENSHIFT_MONGODB_DB_PORT;
    var db = "airportapi";
    var username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
    var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
}
else {
    var host = 'localhost';
    var port = 27017;
    var username;
    var password ;
    var db = 'airportapi';
}
var mongodb = require('mongodb');
module.exports.init = function (cb) {
  var server = new mongodb.Server(host, port);
  new mongodb.Db(db, server, {w: 0}).open(function (error, client) {
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
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
