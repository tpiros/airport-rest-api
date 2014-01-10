var dbconfig = require('../config/db')
, _ = require('underscore')
, acceptableParams = ['sort', 'order', 'fields'];

exports.all = function(req, res) {
  var query = req.query
  , keys = _.keys(query)
  , sort = false
  , order = 1
  , sorting = {}
  , projection = {}
  , tmp = '';
  _.each(keys, function(k) {
  if (_.contains((acceptableParams),k)) {
      if (k === "sort") {
        sort = true;
        sorting[query[k]] = 1;
        tmp = query[k];
      }
      if (sort && k === "order") {
        var option = query[k].toLowerCase();
        if (option === "asc") sorting[tmp] = 1
        if (option === "desc") sorting[tmp] = -1
      }
    if (k === "fields") {
      var fields = query[k].split(',');
      for (var i = 0; i<fields.length; i++) {
        projection[fields[i]] = 1;
        if (fields[i] !== "_id") {
          projection["_id"] = 0;
        }
      }
    }
  }
});
if (sort) {
  dbconfig.collection.find({}, projection).sort(sorting).toArray(function(err, airports){
    res.json(airports);
  });
} else {
    dbconfig.collection.find({}, projection).toArray(function(err, airports){
      res.json(airports);
    });
  }
}

exports.airportIATA = function(req, res) {
  iataCode = decodeURI(req.params.iata).toUpperCase();
  dbconfig.collection.findOne({iata_code: iataCode}, function(err, airport){
    res.json(airport);
  });
}

exports.airportType = function(req, res) {
  airporttype = decodeURI(req.params.airporttype);
  dbconfig.collection.find({ airport_type: airporttype }).toArray(function(err, airports){
    res.json(airports);
  });
}

exports.airportDistance = function(req, res) {
  var query = req.query
  , keys = _.keys(query)
  , sort = false
  , order = 1
  , sorting = {}
  , projection = {}
  , tmp = '';
  _.each(keys, function(k) {
  if (_.contains((acceptableParams),k)) {
      if (k === "sort") {
        sort = true;
        sorting[query[k]] = 1;
        tmp = query[k];
      }
      if (sort && k === "order") {
        var option = query[k].toLowerCase();
        if (option === "asc") sorting[tmp] = 1
        if (option === "desc") sorting[tmp] = -1
      }
    if (k === "fields") {
      var fields = query[k].split(',');
      for (var i = 0; i<fields.length; i++) {
        projection[fields[i]] = 1;
        if (fields[i] !== "_id") {
          projection["_id"] = 0;
        }
      }
    }
  }
});
  distance = decodeURI(req.params.distance);
  var lat = parseFloat(req.query["lat"]);
  var lng = parseFloat(req.query["lng"]);
  distance = distance * 1000;
  var q = {'loc': { $near: { $geometry: { 'type': 'Point', 'coordinates': [lng, lat]}}, $maxDistance: distance}};
  if (sort) {
  dbconfig.collection.find(q, projection).sort(sorting).toArray(function(err, airports){
    res.json(airports);
  });
} else {
    dbconfig.collection.find(q, projection).toArray(function(err, airports){
      res.json(airports);
    });
  }
}
