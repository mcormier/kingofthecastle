function PPSinglesEditController(player1TextId, player2TextId, player1RadioId, player2RadioId, tournament) {
  if (player1TextId == null || player2TextId == null || player1RadioId == null || player2RadioId == null) {
    throw new Error("PPSinglesEditController missing required parameter.");
  }

  this.superclass(tournament);

  this.player1TextId = player1TextId;
  this.player2TextId = player2TextId;

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
}
