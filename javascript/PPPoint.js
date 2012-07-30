
function PPPoint(x, y) {
  this.x = x;
  this.y = y;
}


 // Public instance methods
 PPPoint.prototype.toString = function() {
   return "(x,y) = (" + this.x + "," + this.y + ")";
 }



// Helper construction method
PPPoint.pointFromCanvasMouseEvent = function (canvas, mouseEvent ) {
  var position = canvas.getBoundingClientRect();

  var point = new PPPoint();
  point.x = mouseEvent.clientX - position.left;
  point.y = mouseEvent.clientY - position.top;

  return point;
}

