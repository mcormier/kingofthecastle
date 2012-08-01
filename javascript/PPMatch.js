
//
// round: a number between 0 and 5 representing the round of play.  I.E. quarter finals, finals
// position: a number representing the match number in the round
//
function PPMatch(round, position, tournament) {
  this.round = round;
  this.position = position;

  this.selected = false;

  this.player1 = new PPPlayer("");
  this.player2 = new PPPlayer("");
  this.winner = null;

  Object.defineProperty( this, 'tournament', {
         writable:true,
         configurable:true,
         enumerable:false  // exclude from JSON
  });

  this.tournament = tournament;

}


PPMatch.prototype.completed = function () {
  if ( this.winner == null ) {
    return false;
  }

  return true;
}

// Returns an integer:
// 0 if there is no winner
// 1 if the winner is player 1
// 2 if the winner is player 2
PPMatch.prototype.winnerOrdinal = function () {
  if ( this.completed() ) {
    return this.winner;
  } else {
    return 0;
  }
}

PPMatch.prototype.getWinnerName = function () {
  if ( this.winner == 1 ) {
    return this.getPlayer1Name();
  }
  if ( this.winner == 2 ) {
    return this.getPlayer2Name();
  }
}

PPMatch.prototype.setPlayer1Name = function(name) {
  this.player1.name = name;
}

PPMatch.prototype.getPlayer1Name = function () {
  if (this.round > 0 ) {
    // round = round - 1
    // position = position * 2
    var lastMatch = this.tournament.rounds[this.round-1][this.position*2];
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player1.name;
}

PPMatch.prototype.setPlayer2Name = function(name) {
  this.player2.name = name;
}

PPMatch.prototype.getPlayer2Name = function () {
  if (this.round > 0 ) {
    // round = round - 1
    // position = position * 2 + 1
    var lastMatch = this.tournament.rounds[this.round-1][this.position*2 + 1];
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player2.name;
}

PPMatch.prototype.canBePlayed = function () {
  if (this.round > 0 ) {
    return this.tournament.rounds[this.round-1][this.position*2].completed()
       && this.tournament.rounds[this.round-1][this.position*2 + 1].completed();
  }
  return true;
}



PPMatch.fromObject = function(obj, tournament) {
    var match = new PPMatch(obj.round, obj.position, tournament);
    match.selected = obj.selected;
    match.winner = obj.winner;
    if (obj.round == 0 ) {
      match.setPlayer1Name(obj.player1.name);
      match.setPlayer2Name(obj.player2.name);
    }
    return match;
}