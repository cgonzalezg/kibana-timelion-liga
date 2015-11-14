// "TEMPORADA","LIGA","EQUIPO","JUGADOR","PJUGADOS",
// "PCOMPLETOS","PTITULAR","PSUPLENTE","MINUTOS","LESIONES","TARJETAS",
// "EXPULSIONES","GOLES","PENALTIES FALLADOS"
function lineToJSON(record, callback) {
  // body...

  var plantilla = {
    season: record[0],
    division: record[1],
    team: record[2],
    player: record[3],
    gamesPlayed: record[4],
    gamesFinish: record[5],
    gamesFirstTeam: record[6],
    gamesSubtitute: record[7],
    minutes: record[8],
    injured: record[9],
    yellowCards: record[10],
    redCards: record[11],
    goals: record[12],
    failPenalties: record[13]
  };

  callback(null, plantilla);
}
module.exports = {
  lineToJSON: lineToJSON
};
