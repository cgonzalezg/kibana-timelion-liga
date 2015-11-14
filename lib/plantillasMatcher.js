// "TEMPORADA","LIGA","EQUIPO","JUGADOR","PJUGADOS",
// "PCOMPLETOS","PTITULAR","PSUPLENTE","MINUTOS","LESIONES","TARJETAS",
// "EXPULSIONES","GOLES","PENALTIES FALLADOS"
var moment = require('moment');
var elasticsearch = require('elasticsearch');
var async = require('async');
var Conf = require('../conf.js');
var client = new elasticsearch.Client({
  host: process.env.ES_SERVER || 'elasticsearch:9200',
});

function createQuery(season, order) {
  return {
    index: 'liga',
    type: 'partidos',
    body: {
      "size": 1,
      "query": {
        "term": {
          "season": season
        }
      },
      "sort": [{
        "date": {
          "order": order
        }
      }],
      "fields": [
        "date"
      ]
    }
  };
}

function getDate(plantilla, callback) {
  async.parallel({
    startDate: function(cb) {
      var query = createQuery(plantilla.season, 'asc');
      client.search(query, function(err, resp) {
        if (err) {
          console.error(err);
          return cb(err);
        }
        plantilla.startSeason = resp.hits.hits[0].fields.date[0];
        cb(err);
      });
    },
    finishDate: function(cb) {
      var query = createQuery(plantilla.season, 'desc');
      client.search(query, function(err, resp) {
        if (err) return cb(err);
        plantilla.finishSeason = resp.hits.hits[0].fields.date[0];
        plantilla.date = resp.hits.hits[0].fields.date[0];
        cb(err);
      });
    }
  }, callback);

}

function lineToJSON(record, callback) {
  // body...

  var plantilla = {
    season: record[0],
    division: record[1],
    team: record[2],
    player: record[3],
    gamesPlayed: parseInt(record[4]),
    gamesFinish: parseInt(record[5]),
    gamesFirstTeam: parseInt(record[6]),
    gamesSubtitute: parseInt(record[7]),
    minutes: parseInt(record[8]),
    injured: parseInt(record[9]),
    yellowCards: parseInt(record[10]),
    redCards: parseInt(record[11]),
    goals: parseInt(record[12]),
    failPenalties: parseInt(record[13]),
  };

  getDate(plantilla, function() {
    callback(null, plantilla);
  });

}
module.exports = {
  lineToJSON: lineToJSON
};
