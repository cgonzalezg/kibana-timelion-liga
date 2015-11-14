/**
 * Libraries
 */
var Indexer = require('./lib/indexer.js');
var matchesFile = './data_matches/resultados.csv';

Indexer.matches(matchesFile, function () {
  console.log('end');
});
