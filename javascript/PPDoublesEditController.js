function PPDoublesEditController(tournamentTitleTextId, player1TextId, player1bTextId,
                                 player2TextId, player2bTextId, player1RadioId, player2RadioId, tournament) {

  PPDoublesEditController.superclass.call(this, tournamentTitleTextId, player1TextId, player2TextId,
                                                player1RadioId, player2RadioId, tournament);

  if (player1bTextId == null || player2bTextId  == null) {
      throw new Error("PPDoublesEditController missing required parameter.");
  }

  this.player1bTextId = player1bTextId;
  this.player2bTextId = player2bTextId;
}

PPUtils.extend (PPDoublesEditController, PPSinglesEditController);

PPDoublesEditController.prototype.bind = function () {
   PPDoublesEditController.superproto.bind.call(this);
  var self = this;
  PPUtils.bind("keyup", $(this.player1bTextId), function () {self.updatePlayer1b(self.player1bTextId);} );
  PPUtils.bind("keyup", $(this.player2bTextId), function () {self.updatePlayer2b(self.player2bTextId);} );
}

PPDoublesEditController.prototype.updatePlayer1b = function (id) {
//  var value = $(id).value;
//  this.getSelectedMatch().setPlayer1Name(value);
  console.log("TODO -- implement...");
}

PPDoublesEditController.prototype.updatePlayer2b = function (id) {
//  var value = $(id).value;
//  this.getSelectedMatch().setPlayer1Name(value);
  console.log("TODO -- implement...");
}