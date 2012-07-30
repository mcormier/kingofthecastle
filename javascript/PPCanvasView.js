
function PPCanvasViewMatch(round, position) {
  this.x = PPCanvasView.xPadding + round * PPCanvasView.matchWidth + round * PPCanvasView.connectorLength * 2;
  this.y = this._match_calculateY(round, position);
}

PPCanvasViewMatch.prototype._match_calculateY = function (round, position ) {
  var y;
  var yMult = Math.pow(2,round) - 1;
  if ( round < 2 ) { yMult = round; }
  y = PPCanvasView.yPadding + yMult * (PPCanvasView.matchHeight / 2) + yMult * (PPCanvasView.yPadding/2);

  var yDeltaMult = round + 1;
  if ( round > 1) { yDeltaMult = round * 2; }

  if ( round > 0 ) {
     var connMult = Math.pow(2, round - 1);
     if ( round == 0 ) { connMult = 0; }
     var yDelta = connMult * PPCanvasView.matchHeight/2 + connMult * PPCanvasView.yPadding/2;
     y += yDelta *4 * position;
    } else {
     y += (PPCanvasView.matchHeight * (yDeltaMult) + PPCanvasView.yPadding * (yDeltaMult)) * position;
    }

  return y;
}

// Public instance methods
PPCanvasViewMatch.prototype.pointSelectsMatch = function(point) {

  if ( point.x >= this.x && point.x <= this.x + PPCanvasView.matchWidth  &&
       point.y >= this.y && point.y <= this.y + PPCanvasView.matchHeight) {
    return true;
  }

  return false;
}
//----------------------------------------------------------------------------------------------------

function PPCanvasView(tournament) {
  this.tournament = tournament;
  this.tournament.addPlayerCountListener(this);

  // A 2 sided array that stores all our x, y match data
  this.matchCordData =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

}

PPCanvasView.prototype.setCanvas = function(canvas) {
  this.canvas = canvas;
  this.context =  this.canvas.getContext("2d");

  this.context.lineWidth = 1;
  this.context.strokeStyle = "black";
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


// TODO -- this is gross.. remove
PPCanvasView.prototype.getConnectorLengthMultiplier = function (roundNumber) {
       if ( roundNumber == 5 ) { return 16; }
       if ( roundNumber == 4 ) { return 8; }
       if ( roundNumber == 3 ) { return 4; }
       return roundNumber;
}

PPCanvasView.prototype.getCoordMatch = function(round, position) {
  var theMatch = this.matchCordData[round][position];
  if (theMatch == null ) {
    theMatch = new PPCanvasViewMatch(round, position);
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
        context.fillStyle="#FF0000";  // TODO -- push this out to a configuration class.
        context.fillRect( gMatch.x, gMatch.y, PPCanvasView.matchWidth, PPCanvasView.matchHeight);
        context.rect( gMatch.x, gMatch.y, PPCanvasView.matchWidth, PPCanvasView.matchHeight);
      } else {
        context.rect( gMatch.x, gMatch.y, PPCanvasView.matchWidth, PPCanvasView.matchHeight);
      }

      var connectorY = gMatch.y + PPCanvasView.matchHeight /2;
      var connectorX = gMatch.x;
      var connMult = this.getConnectorLengthMultiplier(roundNumber);
      var yDelta = connMult * PPCanvasView.matchHeight/2 + connMult * PPCanvasView.yPadding/2;
      // Draw lines from this match back to last round
      if ( roundNumber > 0 ) {
        context.moveTo(connectorX, connectorY );
        context.lineTo(connectorX - PPCanvasView.connectorLength, connectorY);

        context.lineTo(connectorX - PPCanvasView.connectorLength, connectorY - yDelta);
        context.moveTo(connectorX - PPCanvasView.connectorLength, connectorY);
        context.lineTo(connectorX - PPCanvasView.connectorLength, connectorY + yDelta);
      }

      // Draw lines from match to next round
      if ( rounds[roundNumber+1].length > 0 ) {
        connectorX = gMatch.x + PPCanvasView.matchWidth;
        context.moveTo(connectorX, connectorY );
        context.lineTo(connectorX + PPCanvasView.connectorLength, connectorY);
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
       PPUtils.log('An error occurred reading this file.');
    };
}


PPCanvasView.prototype.handleClick = function (e) {
       var mouseLocation = PPPoint.pointFromCanvasMouseEvent(this.canvas, e);
       var selectedMatch = null;
       var rounds = tournament.rounds;

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

       tournament.selectedMatch = selectedMatch;
       this.redraw();
}

PPCanvasView.prototype.setDrawingConstants = function (matchWidth, matchHeight, xPadding, yPadding, connLen ) {
       PPCanvasView.matchWidth = matchWidth;
       PPCanvasView.matchHeight = matchHeight;
       PPCanvasView.connectorLength = connLen;
       PPCanvasView.yPadding = yPadding;
       PPCanvasView.xPadding = xPadding;

       // The drawing constants changed because the max number of players changed.  Clear the cached location data.
       // TODO -- probably a better location for this.
       this.matchCordData =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
}

// Static class variables
PPCanvasView.matchWidth = 0;
PPCanvasView.matchHeight = 0;
PPCanvasView.connectorLength = 0;
PPCanvasView.yPadding = 0;
PPCanvasView.xPadding = 0;