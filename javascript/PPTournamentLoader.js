
function PPTournamentLoader(theApp, stateManager) {
   if (theApp == null || stateManager == null) {
        throw new Error("PPTournamentLoader missing required parameter.");
   }

  this.theApp = theApp;
  this.stateManager = stateManager;

  this.tournamentTypes = new Array();

  this.loader = new PPJSONLoader();
}


PPTournamentLoader.prototype.registerTournamentType = function (type) {
  this.tournamentTypes.push(type);
}

// The first tournament type registered is selected by default when
// displaying a radio button list.
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

PPTournamentLoader.prototype.generateRadioList = function (id) {
  var tList = $(id);

  //typeName + "<input id='tTypeRadio" + i + "' name='tType' type='radio' value='" + typeName + "'>" + "<BR>"
  for( var i = 0; i < this.tournamentTypes.length; i ++ ) {
    var typeName = this.tournamentTypes[i].labelName();

    var label = document.createTextNode(typeName);
    tList.appendChild(label);
    var radio = document.createElement('input');
    PPUtils.setElementAttributes( radio , ['id', 'name', 'type', 'value'],
                                          [ "tTypeRadio" + i, "tType", "radio", typeName]);
    if ( i == 0) {
       radio.setAttribute('checked');
    }
    tList.appendChild(radio);
    var brk = document.createElement('br');
    tList.appendChild(brk);

  }

}

PPTournamentLoader.prototype.getSaveData = function() {
  return this.loader.getURIData(this.theApp.tournament);
}


PPTournamentLoader.prototype.process = function(data) {
  var jsonData = this.loader.loadData(data);

  // Convert string to new object statement:
  // "PPTennisTournament" ==> new PPTennisTournament();
  var tournament = eval("new " + jsonData.class +"();");
  tournament.name = jsonData.name;
  tournament.loadRoundsFromJSON(jsonData.rounds);

  this.theApp.setTournament(tournament);
  this.stateManager.startTournament();
  this.theApp.redraw();
}