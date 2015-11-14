/**
 * Libraries
 */
var Indexer = require('./lib/indexer.js');
var matchesFile = './data_matches/resultados.csv';
var elasticsearch = require('elasticsearch');
var async = require('async');
var index = 'liga';
var Conf = require('./conf.js');
var KibanaConf = require('./kibana/kibana-examples.json');
var client = new elasticsearch.Client({
  host: process.env.ES_SERVER || 'elasticsearch:9200',
});

function configureKibana(callback) {
  async.each(KibanaConf, function(kConf, next) {
    console.log(kConf._type);
    client.index({
      index: kConf._index,
      type: kConf._type,
      id: kConf._id,
      body: kConf._source
    }, next);
  }, callback);
}

async.series({
  wait4ES: function(cb) {
    setTimeout(function() {
      cb();
    }, 10000);
  },
  deletePartidos: function(cb) {
    console.log('DELETE', index);
    client.indices.delete({
      index: index
    }, function(err, data) {
      cb();
    });
  },
  deletePlantillas: function(cb) {
    console.log('DELETE', index + 2);

    client.indices.delete({
      index: index + 2
    }, function(err, data) {
      cb();
    });
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
      configureKibana(function() {
        console.log('finish');
      });
    });
  });
});
