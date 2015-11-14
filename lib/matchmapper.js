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
/**
 * Elasticsearch Client
 */
var client = new elasticsearch.Client({
  host: 'boot2docker.me:9200',
});

/**
 * transform data input to a goal
 * @param  {[type]} goal [description]
 * @param  {[type]} min  [description]
 * @return {[type]}      [description]
 */
function parseGoal(goal, min) {
  // body...
  var teamGoal = goal.split("-");
  return {
    team: teamGoal[0],
    author: teamGoal[1],
    minute: parseInt(min)
  };
}

/**
 * transform a group of goalsinto a json Object
 * "J1","M1","J2","M2","J3","M3","J4","M4","J5","M5","J6","M6","J7","M7","J8","M8","J9","M9","J10","M10","J11","M11","J12","M12","J13","M13","J14","M14","J15",151,"J16","M16","J17","M17","J18","M18","J19","M19","J20","M20","J21","M21","J22","M22","J23","M23","J24","M24"
 *
 * @param  {[type]} goals [description]
 * @return {[type]}       [description]
 */
function parseGoals(goals) {
  var goalsJSON = [];
  for (var i = 0; i < goals.length; i += 2) {
    if (goals[i] === '') return goalsJSON;
    var goalJSON = parseGoal(goals[i], goals[i + 1]);
    goalsJSON.push(goalJSON);
  }
  return goalsJSON;
}

/**
 * tramsform a row in to a JSON object
 * "TEMPORADA","LIGA","JORNADA","FECHA","LOCAL ","VISITANTE","GOL L.","GOL. V","ESTADIO","ARBITRO", [ARRAY GOALS]
 * @param  {[type]}   record   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function lineToJSON(record, callback) {
  var entry = {
    season: record[0],
    division: record[1],
    jornada: parseInt(record[2]),
    date: moment(record[3], "MM-DD-YYYY"),
    home: record[4],
    away: record[5],
    home_goals: parseInt(record[6]),
    away_goals: parseInt(record[7]),
    stadium: record[8],
    referee: record[9],
    goals: parseGoals(record.slice(10, record.length))
  };
  callback(null, entry);
}

function indexer(fileNamePath) {
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
      index: 'liga',
      type: 'partidos',
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
  });
}


module.export = {
  indexer: indexer
};
