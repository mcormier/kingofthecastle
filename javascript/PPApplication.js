function PPApplication() { }

PPApplication.prototype.setTournament = function ( tObj ) {
  this.tournament = tObj;
  this.canvasView = new PPCanvasView(this.tournament);
  var canvas = $("myCanvas");  // TODO -- don't hardcode canvas name
  this.canvasView.setCanvas(canvas);
  canvas.onclick = handleCanvasClick; // TODO -- reference to global method
  this.editController = new PPEditController(this.tournament)
  // Setup listeners.
  this.tournament.addSelectedMatchListener(this.editController);
}

PPApplication.prototype.redraw = function () {
  this.canvasView.redraw();
}