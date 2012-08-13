function PPApplication(canvasName) {
  this.canvasName = canvasName;
}

PPApplication.prototype.setTournament = function ( tObj ) {
  this.tournament = tObj;
  this.canvasView = new PPCanvasView(this.tournament);
  var canvas = $(this.canvasName);
  this.canvasView.setCanvas(canvas);
  canvas.onclick = handleCanvasClick; // TODO -- reference to global method
  this.editController = new PPEditController(this.tournament)
  // Setup listeners.
  this.tournament.addSelectedMatchListener(this.editController);
}

PPApplication.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}


PPApplication.prototype.redraw = function () {
  this.canvasView.redraw();
}