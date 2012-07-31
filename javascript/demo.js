"use strict";

function $(id){ return document.getElementById(id); }

function showElement( e ) { e.style.visibility = "visible"; }
function hideElement( e ) { e.style.visibility = "hidden"; }

function PPUtils() {}

PPUtils.log = function ( output ) {
    if (window.console ) {
      console.log(output);
    }
}

PPUtils.objectImplementsMethod = function ( obj, method ) {

  if (obj == null || !obj[method] || typeof obj[method] !== 'function') {
    return false;
  }

  return true;
}

// References:
//   http://krasimirtsonev.com/blog/article/object-oriented-programming-oop-in-javascript-extending-Inheritance-classes
//   http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
PPUtils.extend = function (ChildClass, ParentClass) {
    var parent = new ParentClass();
    ChildClass.prototype = parent;
    ChildClass.prototype.super = parent.constructor;
    ChildClass.prototype.constructor = ChildClass;
}


// Returns the callback so that it can be removed later
PPUtils.bindTextField = function(event, id, boundObj, objCallback) {

  var callback = function receive(evt) {
    boundObj[objCallback](id, evt);
  }

  $(id).addEventListener(event, callback, false);

  return callback;
}
PPUtils.bind = function(event, id, callback) {

  $(id).addEventListener(event, callback, false);

}
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
function PPPlayer(name) {
  this.name = name;
}


 // Public instance methods
 PPPlayer.prototype.toString = function() {
   return "Player.name = " + this.name;
 }



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

function PPTournament(name) {
  this.setName(name);

  // A 2 sided array stores all our match data
  this.rounds =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

  Object.defineProperty( this, 'selectedMatch', {
       get: function() { return this.selectedMatchValue; },
       // TODO -- extract a notify listeners pattern?
       set: function(newValue) {  this.selectedMatchValue = newValue;
                                  for (var i = 0 ; i < this.selectedMatchListeners.length; i++) {
                                    var obj = this.selectedMatchListeners[i];
                                    obj.selectMatch(this.selectedMatch);
                                  }
                               },
       configurable:true,
       enumerable:false  // exclude from JSON
  });

 Object.defineProperty( this, 'maxPlayerCount', {
       get: function() { return maxCount; },
       set: function(newValue) {  this.maxCount = newValue;
                                  for (var i = 0 ; i < this.playerCountListeners.length; i++) {
                                    var obj = this.playerCountListeners[i];
                                    obj.maxPlayerCountChanged(this.maxCount);
                                  }
                               },
       configurable:true,
       enumerable:false  // exclude from JSON
  });

    Object.defineProperty( this, 'playerCountListeners', {
           value:new Array(),
           writable:true,
           configurable:true,
           enumerable:false  // exclude from JSON
      });


  Object.defineProperty( this, 'selectedMatchListeners', {
         value:new Array(),
         writable:true,
         configurable:true,
         enumerable:false  // exclude from JSON
    });

}

PPTournament.prototype.getName = function () {  return this.name; }
PPTournament.prototype.setName = function (value) {  this.name = value; }

PPTournament.prototype.addSelectedMatchListener = function (listenerObj) {
   if ( ! PPUtils.objectImplementsMethod( listenerObj, "selectMatch") ) {
       throw new Error("maxPlayerCountChanged function is not implemented by listener.");
    }

  this.selectedMatchListeners.push(listenerObj);
}

PPTournament.prototype.addPlayerCountListener = function (listenerObj) {
   if ( ! PPUtils.objectImplementsMethod( listenerObj, "maxPlayerCountChanged") ) {
       throw new Error("maxPlayerCountChanged function is not implemented by listener.");
    }

  this.playerCountListeners.push(listenerObj);
}

PPTournament.prototype.clearRounds = function () {
  this.rounds =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
}

PPTournament.prototype.loadRoundsFromJSON = function (jsonData) {
  this.maxPlayerCount = jsonData[0].length * 2;

  for(var i = 0; i < jsonData.length; i++ ) {
      for (var j = 0; j < jsonData[i].length; j++) {
        this.rounds[i][j] = PPMatch.fromObject(jsonData[i][j], this);
      }
    }

}

PPTournament.prototype.getSelectedMatch = function () {
   for (var i = 0; i < this.rounds.length; i++) {
     for (var j = 0; j < this.rounds[i].length; j++ ) {
       if( this.rounds[i][j].selected ) {
         return this.rounds[i][j];
       }
     }
   }
  return null;
}

PPTournament.prototype.titleChanged = function (id, evt) {
    this.name = $(id).value;
}


PPTournament.prototype.setMaxNumberOfPlayers = function (maxPlayerNumber) {

}


// TODO -- assumes number of 4,8,16,32,64
// Support intermediate player numbers...
PPTournament.prototype.createBlankData = function (playerNumber) {
  this.clearRounds();
  this.maxPlayerCount = playerNumber;

  var rnd = 0;
  for(var x = playerNumber/2; x >= 1; x = x/2 ) {
    for (var i = 0; i < x; i++) {
      var match = new PPMatch(rnd, i, this);
      this.rounds[rnd].push( match );
    }
    rnd++;
  }


}

function PPTennisTournament(name) {
  this.super(name);
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPTennisTournament, PPTournament);

PPTennisTournament.typeName = function () {
 return "Tennis";
}


//
// round: a number between 0 and 5 representing the round of play.  I.E. quarter finals, finals
// position: a number representing the match number in the round
//
function PPMatch(round, position, tournament) {
  this.round = round;
  this.position = position;

  this.selected = false;

  this.player1 = new PPPlayer("");
  this.player2 = new PPPlayer("");
  this.winner = null;

  Object.defineProperty( this, 'tournament', {
         get: function() { return this.parent; },
         set: function(newValue) {  this.parent = newValue; },
         configurable:true,
         enumerable:false  // exclude from JSON
  });

  this.tournament = tournament;

}


PPMatch.prototype.completed = function () {
  if ( this.winner == null ) {
    return false;
  }

  return true;
}

// Returns an integer:
// 0 if there is no winner
// 1 if the winner is player 1
// 2 if the winner is player 2
PPMatch.prototype.winnerOrdinal = function () {
  if ( this.completed() ) {
    return this.winner;
  } else {
    return 0;
  }
}

PPMatch.prototype.getWinnerName = function () {
  if ( this.winner == 1 ) {
    return this.getPlayer1Name();
  }
  if ( this.winner == 2 ) {
    return this.getPlayer2Name();
  }
}

PPMatch.prototype.setPlayer1Name = function(name) {
  this.player1.name = name;
}

PPMatch.prototype.getPlayer1Name = function () {
  if (this.round > 0 ) {
    // round = round - 1
    // position = position * 2
    var lastMatch = this.tournament.rounds[this.round-1][this.position*2];
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player1.name;
}

PPMatch.prototype.setPlayer2Name = function(name) {
  this.player2.name = name;
}

PPMatch.prototype.getPlayer2Name = function () {
  if (this.round > 0 ) {
    // round = round - 1
    // position = position * 2 + 1
    var lastMatch = this.tournament.rounds[this.round-1][this.position*2 + 1];
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player2.name;
}

PPMatch.prototype.canBePlayed = function () {
  if (this.round > 0 ) {
    return this.tournament.rounds[this.round-1][this.position*2].completed()
       && this.tournament.rounds[this.round-1][this.position*2 + 1].completed();
  }
  return true;
}



PPMatch.fromObject = function(obj, tournament) {
    var match = new PPMatch(obj.round, obj.position, tournament);
    match.selected = obj.selected;
    match.winner = obj.winner;
    if (obj.round == 0 ) {
      match.setPlayer1Name(obj.player1.name);
      match.setPlayer2Name(obj.player2.name);
    }
    return match;
}