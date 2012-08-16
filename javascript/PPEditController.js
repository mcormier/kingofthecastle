
function PPEditController(tournament) {
   if (tournament != null ) { this.setTournament(tournament); }
}

PPEditController.prototype.setTournament = function(tournament) {
  this.tournament = tournament;
  this.tournament.addSelectedMatchListener(this);

  if ( this.isMatchSelected() ) {
    this.selectMatch(this.getSelectedMatch());
  }
}

PPEditController.prototype.setMatchWinner = function() {throw new Error("Abstract method PPEditController.setMatchWinner"); }
PPEditController.prototype.disablePlayerTextFields = function(state) {throw new Error("Abstract method PPEditController.disablePlayerTextFields"); }
PPEditController.prototype.disableWinnerRadioButtons = function (state) {  throw new Error("Abstract method PPEditController.disableWinnerRadioButtons");}
PPEditController.prototype.setEditorValues = function (match) {throw new Error("Abstract method PPEditController.setEditorValues");}
PPEditController.prototype.setRadioValues = function (match) { throw new Error("Abstract method PPEditController.setRadioValues"); }

PPEditController.prototype.updatePlayer1 = function (id) {
  var value = $(id).value;
  this.getSelectedMatch().setPlayer1Name(value);
}

PPEditController.prototype.updatePlayer2 = function (id) {
  var value = $(id).value;
  this.getSelectedMatch().setPlayer2Name(value);
}

PPEditController.prototype.isMatchSelected = function () {
  if ( this.tournament.getSelectedMatch() != null ) { return true;}
  return false;
}

PPEditController.prototype.getSelectedMatch = function() {
  var selectedMatch = this.tournament.getSelectedMatch();

  if (selectedMatch == null ) {
    throw new Error("Unexpected state, no match selected.");
  }
  return selectedMatch;
}

PPEditController.prototype.selectMatch = function ( selectedMatch /* PPMatch */ ) {
     if ( selectedMatch == null  ) {
       this.disablePlayerTextFields(true);
     } else {
       this.disablePlayerTextFields(false);
     }

     if ( selectedMatch != null && !selectedMatch.canBePlayed() ) {
       this.disableWinnerRadioButtons(true);
     } else {
       this.disableWinnerRadioButtons(false);
     }

     this.setEditorValues(selectedMatch);

     this.setRadioValues(selectedMatch);
}





