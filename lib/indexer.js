/**
 * Libraries
 */
var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');
var elasticsearch = require('elasticsearch');
var WritableBulk = require('elasticsearch-streams').WritableBulk;
var TransformToBulk = require('elasticsearch-streams').TransformToBulk;
var uuid = require('node-uuid');
var moment = require('moment');
var matchmapper = require('./matchmapper.js');
var plantillaMapper = require('./plantillasMatcher.js');
var esMatchMapping = require('./esMatchMapping.json');
var esPlantillasMapping = require('./esPlantillasMapping.json');
var async = require('async');
var Conf = require('../conf.js');
/**
 * Elasticsearch Client
 */
var client = new elasticsearch.Client({
  host: process.env.ES_SERVER || 'elasticsearch:9200',
});

function indexer(lineToJSON, fileNamePath, index, type, callback) {
  // Cvs parser stream reader
  var parser = parse({
    delimiter: ','
  });
  var cvsReader = fs.createReadStream(fileNamePath);

  // Stream transform cvs to JSON object
  var transformer = transform(lineToJSON, {
    parallel: 10
  });
  // Stream write to ES
  var bulkExec = function(bulkCmds, callback) {
    client.bulk({
      index: index,
      type: type,
      body: bulkCmds
    }, callback);
  };
  var ws = new WritableBulk(bulkExec);

  var toBulk = new TransformToBulk(function getIndexTypeId(doc) {
    return {
      _id: uuid.v4(),
    };
  });
  cvsReader.pipe(parser).pipe(transformer).pipe(toBulk).pipe(ws).on('close', function() {
    console.log('finish');
    callback();
  });
}

function mappingES(file, index, type, esTypeMap, callback) {

  client.indices.putMapping({
    index: index,
    type: type,
    body: esTypeMap
  }, function(err, resp) {
    console.log('MAPPING:', type);
    console.log(err);
    console.log(resp);
    callback();
  });
}

function matches(file, index, callback) {

  var type = 'partidos';
  var mapping = esMatchMapping;
  mappingES(file, index, type, mapping, function() {
    indexer(matchmapper.lineToJSON, file, index, type, callback);
  });
}

function plantillas(file, index, callback) {
  var type = 'plantillas';
  var mapping = esPlantillasMapping;
  mappingES(file, index, type, mapping, function() {
    indexer(plantillaMapper.lineToJSON, file, index, type, callback);
  });
}

module.exports = {
  matches: matches,
  plantillas: plantillas
};
