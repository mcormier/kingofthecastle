
// TODO -- recursive code is fun but annoying to debug in the long run...rearchitect

//
// round: a number between 0 and 5 representing the round of play.  I.E. quarter finals, finals
// position: a number representing the match number in the round
//
function PPMatch(round, position, tournament) {

  this.selected = false;

   this.winner = null;

  // exclude from JSON
  Object.defineProperty( this, 'tournament', {writable:true,configurable:true,enumerable:false});
  Object.defineProperty( this, 'position', {writable:true,configurable:true,enumerable:false});
  Object.defineProperty( this, 'round', {writable:true,configurable:true,enumerable:false});

  this.tournament = tournament;
  this.round = round;
  this.position = position;

   // All player data is stored at the first round.
  if (this.round == PPMatch.FIRST_ROUND ) {
    this.player1 = new PPPlayer("");
    this.player2 = new PPPlayer("");
  }

}

PPMatch.FIRST_ROUND = 0;
PPMatch.NO_WINNER = 0;
PPMatch.Player1 = 1;
PPMatch.Player2 = 2;

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
    return PPMatch.NO_WINNER;
  }
}

PPMatch.prototype.getWinnerName = function () {
  if ( this.winner == PPMatch.Player1 ) {
    return this.getPlayer1Name();
  }
  if ( this.winner == PPMatch.Player2 ) {
    return this.getPlayer2Name();
  }
}

PPMatch.prototype.getWinningPlayer = function () {
    if ( this.winner == PPMatch.Player1 ) {
      return this.getPlayer1();
    }
    if ( this.winner == PPMatch.Player2 ) {
      return this.getPlayer2();
    }
}

PPMatch.prototype.getLHSMatch = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    throw new Error("Not possible, there are no prior rounds.")
  }
  return this.tournament.rounds[this.round-1][this.position*2];

}

PPMatch.prototype.getPlayer1 = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    return this.player1;
  }
  var lastMatch = this.getLHSMatch();
  return lastMatch.getWinningPlayer();
}

PPMatch.prototype.getPlayer2 = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    return this.player2;
  }
  var lastMatch = this.getRHSMatch();
  return lastMatch.getWinningPlayer();
}

PPMatch.prototype.setPlayer1Name = function(name) {
  var player = this.getPlayer1();
  player.name = name;
}

PPMatch.prototype.getPlayer1Name = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    // round = round - 1
    // position = position * 2
    var lastMatch = this.getLHSMatch();
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player1.name;
}

PPMatch.prototype.setPlayer2Name = function(name) {
  var player = this.getPlayer2();
  player.name = name;
}

PPMatch.prototype.getRHSMatch = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    throw new Error("Not possible, there are no prior rounds.")
  }
  return this.tournament.rounds[this.round-1][this.position*2 + 1];

}

PPMatch.prototype.getPlayer2Name = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    // round = round - 1
    // position = position * 2 + 1
    var lastMatch = this.getRHSMatch();
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player2.name;
}

PPMatch.prototype.canBePlayed = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    return this.getLHSMatch().completed()
       && this.getRHSMatch().completed();
  }
  return true;
}



PPMatch.fromObject = function(round, position, obj, tournament) {
    var match = new PPMatch(round, position, tournament);
    match.selected = obj.selected;
    match.winner = obj.winner;
    if (round == PPMatch.FIRST_ROUND ) {
      match.setPlayer1Name(obj.player1.name);
      match.setPlayer2Name(obj.player2.name);
    }
    return match;
}