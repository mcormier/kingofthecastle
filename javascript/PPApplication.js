function PPApplication(canvasName, editor) {
  this.canvasName = canvasName;

  if (editor != null ) {
    this.setEditController(editor);
  }
}

PPApplication.prototype.setEditController = function (controller) {
  this.editController = controller;

  if(this.tournament != null ) {
    this.editController.setTournament(this.tournament);
  }
}

PPApplication.prototype.setCanvasView = function (view) {
  this.canvasView = view;

  var canvas = $(this.canvasName);
  var self = this;

  this.canvasView.setCanvas(canvas);

  canvas.onclick = function handleClick (e) {
    self.canvasView.handleClick(e);
  }

}

PPApplication.prototype.setTournament = function ( tObj ) {
  this.tournament = tObj;

  this.setCanvasView( new PPCanvasView(this.tournament) );

  if (this.editController != null ) {
    this.editController.setTournament(this.tournament);
  }

}

PPApplication.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}


PPApplication.prototype.redraw = function () {
  this.canvasView.redraw();
}
