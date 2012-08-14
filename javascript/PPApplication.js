function PPApplication(canvasName, editor, canvasView) {
  this.documentLoaded = false;
  this.canvasName = canvasName;

  if (editor != null ) { this.setEditController(editor); }
  if (canvasView != null) {  this.setCanvasView(canvasView);}
}

PPApplication.prototype.listenForOnLoad = function () {
  var self = this;
  // TODO IE... understands attachEvent not addEventListener...
  window.addEventListener("load", function () {self.onLoad();} , false);
}

PPApplication.prototype.onLoad = function () {
  this.documentLoaded = true;
  this.linkCanvasViewToElement();
}

PPApplication.prototype.setEditController = function (controller) {
  this.editController = controller;
  if(this.tournament != null ) { this.editController.setTournament(this.tournament);}
}

PPApplication.prototype.linkCanvasViewToElement = function () {
  var canvas = $(this.canvasName);
  var self = this;

  this.canvasView.setCanvas(canvas);

  canvas.onclick = function handleClick (e) {
    self.canvasView.handleClick(e);
  }
}

PPApplication.prototype.setCanvasView = function (view) {
  this.canvasView = view;
  if (this.documentLoaded) { this.linkCanvasViewToElement(); }
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
