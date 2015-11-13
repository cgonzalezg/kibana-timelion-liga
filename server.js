/**
 * Libraries
 */
var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

function parseGoal(goal, min) {
  // body...
  var teamGoal = goal.split("-");
  return {
    team: teamGoal[0],
    author: teamGoal[1],
    minute: min
  };
}

function parseGoals(goals) {
  var goalsJSON = [];
  for (var i = 0; i < goals.length; i+=2) {
    if (goals[i] === '') return goalsJSON;
    var goalJSON = parseGoal(goals[i], goals[i + 1]);
    goalsJSON.push(goalJSON);
  }
  return goalsJSON;
}

function lineToJSON(record, callback) {
  // console.log(record);
  // "TEMPORADA","LIGA","JORNADA","FECHA","LOCAL ","VISITANTE","GOL L.","GOL. V","ESTADIO","ARBITRO",
  // "J1","M1","J2","M2","J3","M3","J4","M4","J5","M5","J6","M6","J7","M7","J8","M8","J9","M9","J10","M10","J11","M11","J12","M12","J13","M13","J14","M14","J15",151,"J16","M16","J17","M17","J18","M18","J19","M19","J20","M20","J21","M21","J22","M22","J23","M23","J24","M24"

  var entry = {
    season: record[0],
    division: record[1],
    jornada: record[2],
    date: record[3],
    home: record[4],
    away: record[5],
    home_goals: record[6],
    away_goals: record[7],
    stadium: record[8],
    referee: record[9],
    goals: parseGoals(record.slice(10, record.length))
  };
  callback(null, entry);
}

var output = [];
var parser = parse({
  delimiter: ','
});
var input = fs.createReadStream('./liga2831.csv');
var transformer = transform(function(record, callback) {
  setTimeout(function() {
    lineToJSON(record, callback);

    // callback(null, record.join(' ')+'\n');
  }, 500);
}, {
  parallel: 10
});

var transformer2 = transform(function(record, callback) {
  console.log('hola');
  console.log('%j',record);
  callback();
  // setTimeout(function() {
  //   lineToJSON(record, callback);
  //
  //   // callback(null, record.join(' ')+'\n');
  // }, 500);
}, {
  parallel: 10
});

input.pipe(parser).pipe(transformer).pipe(transformer2);
