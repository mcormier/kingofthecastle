function PPDoublesMatch(round, position, tournament) {
  PPDoublesMatch.superclass.call(this,round, position, tournament);

    // All player data is stored at the first round.
    if (this.round == PPMatch.FIRST_ROUND ) {
      this.player1b = new PPPlayer("");
      this.player2b = new PPPlayer("");
    }
}

PPUtils.extend (PPDoublesMatch, PPMatch);


PPMatch.prototype.getPlayer1b = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    return this.player1b;
  }
  var lastMatch = this.getLHSMatch();
  // TODO -- this method falls apart in doubles,
  // need to retrieve winning team.
  return lastMatch.getWinningPlayer();
}

PPMatch.prototype.setPlayer1bName = function(name) {
  var player = this.getPlayer1b();
  player.name = name;
}