function PPSinglesEditController(tournamentTitleTextId, player1TextId, player2TextId, player1RadioId, player2RadioId, tournament) {
  if (tournamentTitleTextId == null || player1TextId == null || player2TextId == null
       || player1RadioId == null || player2RadioId == null) {
    throw new Error("PPSinglesEditController missing required parameter.");
  }

  this.superclass(tournament);

  this.tournamentTitleTextId = tournamentTitleTextId;
  this.player1TextId = player1TextId;
  this.player2TextId = player2TextId;
  this.player1RadioId = player1RadioId;
  this.player2RadioId = player2RadioId;

  var self = this;
  // Bind to html elements when document is loaded.
  PPUtils.bind("load", window, function () {self.bind();} );
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPSinglesEditController, PPEditController);

PPSinglesEditController.prototype.bind = function () {
  var self = this;
  PPUtils.bind("keyup", $(this.player1TextId), function () {self.updatePlayer1(self.player1TextId);} );
  PPUtils.bind("keyup", $(this.player2TextId), function () {self.updatePlayer2(self.player2TextId);} );
  PPUtils.bind("click", $(this.player1RadioId), function () {self.setMatchWinner();} );
  PPUtils.bind("click", $(this.player2RadioId), function () {self.setMatchWinner();} );

  PPUtils.bindTextField("keyup", $(this.tournamentTitleTextId), self, "titleChanged");
}

PPSinglesEditController.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}

PPSinglesEditController.prototype.setMatchWinner = function() {
  var selectedMatch = this.getSelectedMatch();

  if ( $(this.player1RadioId).checked ) {
    selectedMatch.setWinner(PPMatch.Player1);
  } else {
    selectedMatch.setWinner(PPMatch.Player2);
  }

}

PPSinglesEditController.prototype.setTournament = function(tournament) {
  PPSinglesEditController.superproto.setTournament.call(this, tournament);
  $(this.tournamentTitleTextId).value = this.tournament.name;
}

PPSinglesEditController.prototype.disablePlayerTextFields = function (state)  {
       $(this.player1TextId).disabled = state;
       $(this.player2TextId).disabled = state;
}

PPSinglesEditController.prototype.disableWinnerRadioButtons = function (state) {
       $(this.player1RadioId).disabled = state;
       $(this.player2RadioId).disabled = state;
       // Clear the checked state as we disable...
       if ( state == true ) {
         $(this.player1RadioId).checked = false;
         $(this.player2RadioId).checked = false;
       }
}

PPSinglesEditController.prototype.setEditorValues = function (match) {
       if ( match == null ) {
         $(this.player1TextId).value = "";
         $(this.player2TextId).value = "";
       } else {
         $(this.player1TextId).value = match.getPlayer1Name();
         $(this.player2TextId).value = match.getPlayer2Name();
       }
}

PPSinglesEditController.prototype.setRadioValues = function (match) {
       if ( match == null) {
         return;
       }

       if (match.completed()) {
         var winVal = match.winnerOrdinal();
         if ( winVal == PPMatch.Player1 ) {
            $(this.player1RadioId).checked = true;
         }
         if ( winVal == PPMatch.Player1 ) {
            $(this.player2RadioId).checked = true;
         }
       } else {
          $(this.player1RadioId).checked = false;
          $(this.player2RadioId).checked = false;
       }
}