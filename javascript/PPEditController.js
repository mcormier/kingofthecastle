
function PPEditController(tournament) {
  this.tournament = tournament;
  this.selectMatch(this.tournament.getSelectedMatch());
}

PPEditController.prototype.setMatchWinner = function() {
  var selectedMatch = this.tournament.getSelectedMatch();

  if (selectedMatch == null ) {
    throw new Error("Unexpected state");
  }

       // TODO -- Use object method
  if ( $("player1WinnerRadio").checked ) {
    selectedMatch.winner = 1;
  } else {
    selectedMatch.winner = 2;
  }

}


PPEditController.prototype.updatePlayer1 = function (id) {
  var value = $(id).value;
  this.tournament.getSelectedMatch().setPlayer1Name(value);
}

PPEditController.prototype.updatePlayer2 = function (id) {
  var value = $(id).value;
  this.tournament.getSelectedMatch().setPlayer2Name(value);
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

PPEditController.prototype.disablePlayerTextFields = function (state)  {
       $("player1TextField").disabled = state;
       $("player2TextField").disabled = state;
}

PPEditController.prototype.disableWinnerRadioButtons = function (state) {
       $("player1WinnerRadio").disabled = state;
       $("player2WinnerRadio").disabled = state;
       // Clear the checked state as we disable...
       if ( state == true ) {
         $("player1WinnerRadio").checked = false;
         $("player2WinnerRadio").checked = false;
       }
}

PPEditController.prototype.setEditorValues = function (match) {
       if ( match == null ) {
         $("player1TextField").value = "";
         $("player2TextField").value = "";
       } else {
         $("player1TextField").value = match.getPlayer1Name();
         $("player2TextField").value = match.getPlayer2Name();
       }
}

PPEditController.prototype.setRadioValues = function (match) {
       if ( match == null) {
         return;
       }

       if (match.completed()) {
         var winVal = match.winnerOrdinal();
         if ( winVal == 1 ) {
            $("player1WinnerRadio").checked = true;
         }
         if ( winVal == 2 ) {
            $("player2WinnerRadio").checked = true;
         }
       } else {
          $("player1WinnerRadio").checked = false;
          $("player2WinnerRadio").checked = false;
       }
}