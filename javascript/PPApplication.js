function PPApplication(editor, canvasView) {
  if (editor != null ) { this.setEditController(editor); }
  if (canvasView != null) {  this.setCanvasView(canvasView);}
}


PPApplication.prototype.setEditController = function (controller) {
  this.editController = controller;
  if(this.tournament != null ) { this.editController.setTournament(this.tournament);}
}


PPApplication.prototype.setCanvasView = function (view) {
  this.canvasView = view;
  if (this.tournament != null) { this.canvasView.setTournament(this.tournament);}

}

PPApplication.prototype.setTournament = function ( tObj ) {
  this.tournament = tObj;

  if (this.canvasView != null) { this.canvasView.setTournament(this.tournament);}
  if (this.editController != null ) {this.editController.setTournament(this.tournament);}
}

PPApplication.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}


PPApplication.prototype.redraw = function () {
  if (this.canvasView) {this.canvasView.redraw();}
}
