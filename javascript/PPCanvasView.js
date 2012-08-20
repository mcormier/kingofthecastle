
function PPCanvasViewMatch(parent, round, position) {
  this.parent = parent;
  this.x = parent.xPadding + round * parent.matchWidth + round * parent.connectorLength * 2;
  this.y = this._match_calculateY(parent, round, position);
}

PPCanvasViewMatch.prototype._match_calculateY = function (parent, round, position ) {
  var y;
  var yMult = Math.pow(2,round) - 1;
  if ( round < 2 ) { yMult = round; }
  y = parent.yPadding + yMult * (parent.matchHeight / 2) + yMult * (parent.yPadding/2);

  var yDeltaMult = round + 1;
  if ( round > 1) { yDeltaMult = round * 2; }

  if ( round > 0 ) {
     var connMult = Math.pow(2, round - 1);
     if ( round == 0 ) { connMult = 0; }
     var yDelta = connMult * parent.matchHeight/2 + connMult * parent.yPadding/2;
     y += yDelta *4 * position;
    } else {
     y += (parent.matchHeight * (yDeltaMult) + parent.yPadding * (yDeltaMult)) * position;
    }

  return y;
}

// Public instance methods
PPCanvasViewMatch.prototype.pointSelectsMatch = function(point) {

  if ( point.x >= this.x && point.x <= this.x + this.parent.matchWidth  &&
       point.y >= this.y && point.y <= this.y + this.parent.matchHeight) {
    return true;
  }

  return false;
}
//----------------------------------------------------------------------------------------------------

// The elementName is the string value of the id of the canvas element
// the view is linked to.  The view will register for the onload event
// and link to that element when it is available.
function PPCanvasView(elementName, tournament) {
  if (elementName == null ) { throw new Error("PPCanvasView missing required parameter."); }
  this.elementName = elementName;

  // A 2 sided array that stores all our x, y match data
  this.matchCordData =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

  if (tournament != null ) { this.setTournament(tournament); }

  this.selectedMatchColor = "#FF0000";
  this.strokeColor = "#000000";

  var self = this;
  PPUtils.bind("load", window, function () {self.onLoad();} );

}

PPCanvasView.prototype.onLoad = function () {
  this.linkCanvasViewToElement();
}

PPCanvasView.prototype.linkCanvasViewToElement = function () {
  var canvas = $(this.elementName);

  this.setCanvas(canvas);

  var self = this;
  canvas.onclick = function handleClick (e) {
    self.handleClick(e);
  }
}

PPCanvasView.prototype.setTournament = function (tournament) {
   this.tournament = tournament;

   if (this.tournament == null) {
     return;
   }

   this.tournament.addPlayerCountListener(this);
   var maxPlayerCount = this.tournament.maxPlayerCount;
     if (maxPlayerCount) {
       this.maxPlayerCountChanged(this.tournament.maxPlayerCount);
     }

}

PPCanvasView.prototype.setCanvas = function(canvas) {
  this.canvas = canvas;
  this.context =  this.canvas.getContext("2d");

  this.context.lineWidth = 1;
  this.context.strokeStyle = this.strokeColor;
}

PPCanvasView.prototype.clearDisplay = function() {
  this.context.beginPath();
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

// There is a scaling example here
// http://www.html5canvastutorials.com/labs/html5-canvas-scaling-a-drawing-with-plus-and-minus-buttons/
PPCanvasView.prototype.draw = function() {
  var rounds = this.tournament.rounds;
  for(var i = 0; i < rounds.length; i++ ) {
    this.drawRound( i );
  }

  this.context.stroke();
}


PPCanvasView.prototype.getConnectorLengthMultiplier = function (roundNumber) {
       return Math.pow(2,roundNumber - 1);
}

PPCanvasView.prototype.getCoordMatch = function(round, position) {
  var theMatch = this.matchCordData[round][position];
  if (theMatch == null ) {
    theMatch = new PPCanvasViewMatch(this, round, position);
    this.matchCordData[round][position] = theMatch;
  }

  return theMatch;
}

// The roundArray is a two sided array
// An array of rounds that contains an array of matches in each round.
// The roundNumber specifies which round
PPCanvasView.prototype.drawRound = function( roundNumber ) {
    var rounds = this.tournament.rounds;
    var context = this.context;

    for(var i = 0; i < rounds[roundNumber].length; i++ ) {

      var curMatch = rounds[roundNumber][i];
      var gMatch = this.getCoordMatch(roundNumber, i);
      if (curMatch.selected) {
        context.fillStyle=this.selectedMatchColor;
        context.fillRect( gMatch.x, gMatch.y, this.matchWidth, this.matchHeight);
        context.rect( gMatch.x, gMatch.y, this.matchWidth, this.matchHeight);
      } else {
        context.rect( gMatch.x, gMatch.y, this.matchWidth, this.matchHeight);
      }

      var connectorY = gMatch.y + this.matchHeight /2;
      var connectorX = gMatch.x;
      var connMult = this.getConnectorLengthMultiplier(roundNumber);
      var yDelta = connMult * this.matchHeight/2 + connMult * this.yPadding/2;
      // Draw lines from this match back to last round
      if ( roundNumber > 0 ) {
        context.moveTo(connectorX, connectorY );
        context.lineTo(connectorX - this.connectorLength, connectorY);
        context.lineTo(connectorX - this.connectorLength, connectorY - yDelta);
        context.moveTo(connectorX - this.connectorLength, connectorY);
        context.lineTo(connectorX - this.connectorLength, connectorY + yDelta);
      }

      // Draw lines from match to next round
      if ( rounds[roundNumber+1].length > 0 ) {
        connectorX = gMatch.x + this.matchWidth;
        context.moveTo(connectorX, connectorY );
        context.lineTo(connectorX + this.connectorLength, connectorY);
      }

    }

}

PPCanvasView.prototype.redraw = function() {
  this.clearDisplay();
  this.draw();
}

PPCanvasView.prototype.maxPlayerCountChanged = function(maxPlayerCount) {
    switch(maxPlayerCount) {
     case 4:
       this.setDrawingConstants(150, 100, 10,100, 50);break;
     case 8:
       this.setDrawingConstants(120, 70, 10,50, 40);break;
     case 16:
       this.setDrawingConstants(100, 50, 10,20, 30);break;
     case 32:
       this.setDrawingConstants(50, 25, 14,10, 20);break;
     case 64:
       this.setDrawingConstants(50, 10, 10,8, 10);break;
     default:
       PPUtils.log('An unexpected value was passed to maxPlayerCountChanged: ' + maxPlayerCount);
    };
}


PPCanvasView.prototype.handleClick = function (e) {
       var mouseLocation = PPPoint.pointFromCanvasMouseEvent(this.canvas, e);
       var selectedMatch = null;
       var rounds = this.tournament.rounds;

       for (var i = 0; i < rounds.length; i++) {
         for (var j = 0; j < rounds[i].length; j++ ) {
           if( this.getCoordMatch(i,j).pointSelectsMatch(mouseLocation) ) {
              // Toggle match selection
              rounds[i][j].selected = ! rounds[i][j].selected;
              if ( rounds[i][j].selected ) {
                selectedMatch = rounds[i][j];
              }
           } else {
              rounds[i][j].selected = false;
           }
         }
       }

       this.tournament.selectedMatch = selectedMatch;
       this.redraw();
}

PPCanvasView.prototype.setDrawingConstants = function (matchWidth, matchHeight, xPadding, yPadding, connLen ) {
       this.matchWidth = matchWidth;
       this.matchHeight = matchHeight;
       this.connectorLength = connLen;
       this.yPadding = yPadding;
       this.xPadding = xPadding;

       // The drawing constants changed because the max number of players changed.  Clear the cached location data.
       // TODO -- probably a better location for this.
       this.matchCordData =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
}
