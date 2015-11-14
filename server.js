/**
 * Libraries
 */
var Indexer = require('./lib/indexer.js');
var matchesFile = './data_matches/resultados.csv';
var elasticsearch = require('elasticsearch');

var index = 'liga';

var client = new elasticsearch.Client({
  host: 'boot2docker.me:9200',
});
client.indices.delete({
  index: index
}, function(err, resp) {
  console.log('DELETE');
  console.log(resp);
  console.log(err);
  console.log(resp);
  client.indices.create({
    index: index
  }, function(err, resp) {
    console.log('CREATE');
    console.log(err);
    console.log(resp);
    Indexer.matches(matchesFile, index, function() {
      Indexer.plantillas('./data_matches/platillas.csv', index, function() {
        console.log('finish');
      });
    });
  });
});
