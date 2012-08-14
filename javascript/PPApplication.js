function PPApplication(canvasName) {
  this.canvasName = canvasName;
}

PPApplication.prototype.setEditController = function (controller) {
  this.editController = controller;
  this.editController.setTournament(this.tournament);
}

PPApplication.prototype.setTournament = function ( tObj ) {
  this.tournament = tObj;
  this.canvasView = new PPCanvasView(this.tournament);
  var canvas = $(this.canvasName);
  var self = this;

  this.canvasView.setCanvas(canvas);

  canvas.onclick = function handleClick (e) {
    self.canvasView.handleClick(e);
  }

  this.setEditController(new PPEditController());
}

PPApplication.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}


PPApplication.prototype.redraw = function () {
  this.canvasView.redraw();
}
