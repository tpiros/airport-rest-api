var dbconfig         = require('../config/db');
var _                = require('underscore');
var acceptableParams = ['sort', 'order', 'fields', 'callback'];
var sort             = false;
var handler          = {};

function queryHandler(query) {
  var q          = query;
  var keys       = _.keys(q);
  var sort       = false;
  var order      = 1;
  var sorting    = {};
  var projection = {};
  var tmp        = '';
  var handler    = {};

  _.each(keys, function(k) { //for each key (k) in query
    if (_.contains((acceptableParams), k)) {//if any of the keys are in acceptableParams
      if (k === "sort") {
        sort = true;
        sorting[q[k]] = 1;
        tmp = q[k];
      }
      if (sort && k === "order") {
        var option = q[k].toLowerCase();
        if (option === "asc") sorting[tmp] = 1;
        if (option === "desc") sorting[tmp] = -1;
      }
      handler.sort = sorting;
      if (k === "fields") {
        var fields = q[k].split(',');
        for (var i = 0; i<fields.length; i++) {
          fields[i] = fields[i].replace(/ /g,'');
          projection[fields[i]] = 1;
          if (fields[i] !== "_id") {
            projection["_id"] = 0;
          }
        }
        handler.projection = projection;
      }
    }
  });
  return handler;
}

exports.all = function(req, res) {
  console.log('all is called');
  var q = req.query;
  if (!_.isEmpty(q)) {
    handler = queryHandler(req.query);
  }

  if (_.has((handler), "projection") && _.has((handler), "sort")) {
    dbconfig.collection.find({}, handler["projection"]).sort(handler["sort"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else if (_.has((handler), "projection")) {
    dbconfig.collection.find({}, handler["projection"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else if (_.has((handler),"sort")) {
    dbconfig.collection.find({}, {}).sort(handler["sort"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else {
    dbconfig.collection.find({}, {}).toArray(function(err, airports){
      res.jsonp(airports);
    });
  }
}

exports.airportIATA = function(req, res) {
  var q = req.query;
  var iataCode = decodeURI(req.params.iata).toUpperCase();

  if (!_.isEmpty(q)) {
    handler = queryHandler(req.query);
  }

  if (_.has((handler), "projection")) {
    dbconfig.collection.find({iata_code: iataCode}, handler["projection"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else {
    dbconfig.collection.find({iata_code: iataCode}, {}).toArray(function(err, airports){
      res.jsonp(airports);
    });
  }
}

exports.airportType = function(req, res) {
  airporttype = decodeURI(req.params.airporttype);
  dbconfig.collection.find({ airport_type: airporttype }).toArray(function(err, airports){
    res.jsonp(airports);
  });
}

exports.airportDistance = function(req, res) {
  var q = req.query;
  var distance = decodeURI(req.params.distance);
  distance = distance * 1000;
  var lat = parseFloat(req.query["lat"]);
  var lng = parseFloat(req.query["lng"]);
  var dbq = {'loc': { $near: { $geometry: { 'type': 'Point', 'coordinates': [lng, lat]}}, $maxDistance: distance}};

  if (!_.isEmpty(q)) {
    handler = queryHandler(req.query);
  }

  if (_.has((handler), "projection") && _.has((handler), "sort")) {
    dbconfig.collection.find(dbq, handler["projection"]).sort(handler["sort"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else if (_.has((handler), "projection")) {
    dbconfig.collection.find(dbq, handler["projection"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else if (_.has((handler),"sort")) {
    dbconfig.collection.find(dbq, {}).sort(handler["sort"]).toArray(function(err, airports){
      res.jsonp(airports);
    });
  } else {
    dbconfig.collection.find(dbq, {}).toArray(function(err, airports){
      res.jsonp(airports);
    });
  }
}
