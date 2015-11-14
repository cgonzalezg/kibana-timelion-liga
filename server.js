/**
 * Libraries
 */
var Indexer = require('./lib/indexer.js');
var matchesFile = './data_matches/resultados.csv';
var elasticsearch = require('elasticsearch');
var async = require('async');
var index = 'liga';

var client = new elasticsearch.Client({
  host: 'boot2docker.me:9200',
});

async.series({
  deletePartidos: function(cb) {
    console.log('DELETE', index);

    client.indices.delete({
      index: index
    }, cb);
  },
  deletePlantillas: function(cb) {
    console.log('DELETE', index + 2);

    client.indices.delete({
      index: index + 2
    }, cb);
  },
  createPartidos: function(cb) {
    console.log('CREATE', index);

    client.indices.create({
      index: index
    }, cb);
  },
  createPlantillas: function(cb) {
    console.log('CREATE', index + 2);

    client.indices.create({
      index: index + 2
    }, cb);
  }
}, function(callback) {
  Indexer.matches(matchesFile, index, function() {
    Indexer.plantillas('./data_matches/platillas.csv', index + 2, function() {
      console.log('finish');
    });
  });
});
