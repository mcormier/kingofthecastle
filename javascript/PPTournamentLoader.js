
function PPTournamentLoader() {
  this.tournamentTypes = new Array();
}


PPTournamentLoader.prototype.registerTournamentType = function (type) {
  this.tournamentTypes.push(type);
}

PPTournamentLoader.prototype.registerTournamentTypes = function (typeArray) {
  for (var i = 0; i < typeArray.length; i++) {
    this.registerTournamentType(typeArray[i]);
  }
}

PPTournamentLoader.prototype.printTournamentTypes = function () {
  for( var i = 0; i < this.tournamentTypes.length; i++) {
    var tType = this.tournamentTypes[i];
    console.log(tType.typeName());
  }
}

PPTournamentLoader.prototype.getSelectedTournamentType = function () {
  for( var i = 0; i < this.tournamentTypes.length; i ++ ) {
   if ( $("tTypeRadio" + i).checked == true ) {
     return new this.tournamentTypes[i]();
   }
  }
  throw new Error("No tournament type selected");
}


PPTournamentLoader.prototype.process = function(data) {
  var jsonData = JSON.parse(data);

  // reload tournament object
  var tournament = new PPTennisTournament(); // TODO -- temporary  -- Tournament object type should be stored in file
  tournament.name = jsonData.name;
  $("tournamentNameTextField").value = tournament.name; // TODO -- this could be a bound configuration.
  tournament.loadRoundsFromJSON(jsonData.rounds);

  theApp.setTournament(tournament);
  stateManager.startTournament();   // TODO -- global variable

  theApp.redraw();
}