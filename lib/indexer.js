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
/**
 * Elasticsearch Client
 */
var client = new elasticsearch.Client({
  host: 'boot2docker.me:9200',
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

function matches(file, callback) {
  indexer(matchmapper.lineToJSON, file, 'liga', 'partidos', callback);
}

function plantillas() {
  indexer(matchmapper, '../data_matches/platillas.csv', 'liga', 'plantillas');
}

module.exports = {
  matches: matches,
  plantillas: plantillas
};
