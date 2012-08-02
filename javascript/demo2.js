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

PPApplication.prototype.titleChanged = function (id, evt) {
    this.tournament.titleChanged(id,evt);
}


PPApplication.prototype.redraw = function () {
  this.canvasView.redraw();
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

  this.maxPlayerCountChanged(this.tournament.maxPlayerCount);
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
       PPUtils.log('An unexpected value was passed to maxPlayerCountChanged.');
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
function PPEditController(tournament) {
  this.tournament = tournament;
  this.selectMatch(this.tournament.getSelectedMatch());
}

PPEditController.prototype.setMatchWinner = function() {
  var selectedMatch = this.tournament.getSelectedMatch();

  if (selectedMatch == null ) {
    PPUtils.log("Unexpected state");
    return;
  }

       // TODO -- Use object method
  if ( $("player1WinnerRadio").checked ) {
    selectedMatch.winner = 1;
  } else {
    selectedMatch.winner = 2;
  }

}


PPEditController.prototype.updatePlayer1 = function (id) {
  var value = $(id).value;
  this.tournament.getSelectedMatch().setPlayer1Name(value);
}

PPEditController.prototype.updatePlayer2 = function (id) {
  var value = $(id).value;
  this.tournament.getSelectedMatch().setPlayer2Name(value);
}



PPEditController.prototype.selectMatch = function ( selectedMatch /* PPMatch */ ) {
     if ( selectedMatch == null  ) {
       this.disablePlayerTextFields(true);
     } else {
       this.disablePlayerTextFields(false);
     }

     if ( selectedMatch != null && !selectedMatch.canBePlayed() ) {
       this.disableWinnerRadioButtons(true);
     } else {
       this.disableWinnerRadioButtons(false);
     }

     this.setEditorValues(selectedMatch);

     this.setRadioValues(selectedMatch);
}

PPEditController.prototype.disablePlayerTextFields = function (state)  {
       $("player1TextField").disabled = state;
       $("player2TextField").disabled = state;
}

PPEditController.prototype.disableWinnerRadioButtons = function (state) {
       $("player1WinnerRadio").disabled = state;
       $("player2WinnerRadio").disabled = state;
       // Clear the checked state as we disable...
       if ( state == true ) {
         $("player1WinnerRadio").checked = false;
         $("player2WinnerRadio").checked = false;
       }
}

PPEditController.prototype.setEditorValues = function (match) {
       if ( match == null ) {
         $("player1TextField").value = "";
         $("player2TextField").value = "";
       } else {
         $("player1TextField").value = match.getPlayer1Name();
         $("player2TextField").value = match.getPlayer2Name();
       }
}

PPEditController.prototype.setRadioValues = function (match) {
       if ( match == null) {
         return;
       }

       if (match.completed()) {
         var winVal = match.winnerOrdinal();
         if ( winVal == 1 ) {
            $("player1WinnerRadio").checked = true;
         }
         if ( winVal == 2 ) {
            $("player2WinnerRadio").checked = true;
         }
       } else {
          $("player1WinnerRadio").checked = false;
          $("player2WinnerRadio").checked = false;
       }
}// States:
//
// Start --> chooseTournament -> configureTournament --> startTournament
// Start --> loadTournament -> startTournament
function PPState() { }

PPState.START = 0;
PPState.CHOOSE_TOURNAMENT = 1;
PPState.CONFIGURE_TOURNAMENT = 2;
PPState.START_TOURNAMENT = 3;
PPState.LOAD_TOURNAMENT = 4;

// By creating a simple state manager, back button functionality can be
// easily supported.

function PPStateManager() {
  this.currentState = PPState.START;

  this.stateDivMap = new Array();
  this.stateHookFunctionMap = new Array();
  this.stateHistory = new Array();
}

PPStateManager.prototype.linkDivToState = function ( divName, state ) {
  this.stateDivMap[state] = divName;
}

PPStateManager.prototype.linkHookToState = function ( hookFunction, state ) {
  this.stateHookFunctionMap[state] = hookFunction;
}

PPStateManager.prototype.linkDivsToStates = function ( divNameArray, stateArray ) {
  for (var i = 0 ; i < divNameArray.length; i++ ) {
    this.linkDivToState(divNameArray[i], stateArray[i]);
  }
}

PPStateManager.prototype.linkHooksToStates = function ( hookFunctionArray, stateArray ) {
  for (var i = 0 ; i < hookFunctionArray.length; i++ ) {
    this.linkHookToState(hookFunctionArray[i], stateArray[i]);
  }
}

PPStateManager.prototype.linkDivsAndHooksToStates = function ( divNameArray, hookFunctionArray, stateArray ) {
  this.linkDivsToStates(divNameArray, stateArray);
  this.linkHooksToStates(hookFunctionArray, stateArray);
}


PPStateManager.prototype.back = function() {
  hideElement($(this.stateDivMap[this.currentState]));
  this.currentState = this.stateHistory.pop();
  showElement($(this.stateDivMap[this.currentState]));
}

PPStateManager.prototype.changeStateTo = function (state) {
  // hide old state
  this.stateHistory.push(this.currentState);
  hideElement($(this.stateDivMap[this.currentState]));

  // Show new state
  this.currentState = state
  showElement($(this.stateDivMap[this.currentState]));

  var fx = this.stateHookFunctionMap[this.currentState];
  if ( fx != null ) { fx(); }
}

PPStateManager.prototype.newTournament = function() { this.changeStateTo(PPState.CHOOSE_TOURNAMENT); }
PPStateManager.prototype.configureTournament = function() { this.changeStateTo(PPState.CONFIGURE_TOURNAMENT); }
PPStateManager.prototype.startTournament = function() { this.changeStateTo(PPState.START_TOURNAMENT); }
PPStateManager.prototype.loadTournament = function() { this.changeStateTo(PPState.LOAD_TOURNAMENT);}

function PPTournamentLoader() {
  this.tournamentTypes = new Array();
}


PPTournamentLoader.prototype.registerTournamentType = function (type) {
  this.tournamentTypes.push(type);
}

// The first tournament type registered is selected by default when
// displaying a radio button list.
PPTournamentLoader.prototype.registerTournamentTypes = function (typeArray) {
  for (var i = 0; i < typeArray.length; i++) {
    this.registerTournamentType(typeArray[i]);
  }
}

PPTournamentLoader.prototype.printTournamentTypes = function () {
  for( var i = 0; i < this.tournamentTypes.length; i++) {
    var tType = this.tournamentTypes[i];
    console.log(tType.typeName());
  }
}

PPTournamentLoader.prototype.getSelectedTournamentType = function () {
  for( var i = 0; i < this.tournamentTypes.length; i ++ ) {
   if ( $("tTypeRadio" + i).checked == true ) {
     return new this.tournamentTypes[i]();
   }
  }
  throw new Error("No tournament type selected");
}

PPTournamentLoader.prototype.generateRadioList = function (id) {
  var tList = $(id);

  //typeName + "<input id='tTypeRadio" + i + "' name='tType' type='radio' value='" + typeName + "'>" + "<BR>"
  for( var i = 0; i < this.tournamentTypes.length; i ++ ) {
    var typeName = this.tournamentTypes[i].labelName();

    var label = document.createTextNode(typeName);
    tList.appendChild(label);
    var radio = document.createElement('input');
    // TODO -- setAttributes helper method... two arrays...
    radio.setAttribute('id', "tTypeRadio" + i);
    radio.setAttribute('name', "tType");
    radio.setAttribute('type', "radio");
    radio.setAttribute('value', typeName);
    if ( i == 0) {
       radio.setAttribute('checked');
    }
    tList.appendChild(radio);
    var brk = document.createElement('br');
    tList.appendChild(brk);

  }

}

PPTournamentLoader.prototype.process = function(data) {
  var jsonData = JSON.parse(data);

  // Convert string to new object statement:
  // "PPTennisTournament" ==> new PPTennisTournament();
  var tournament = eval("new " + jsonData.class +"();");
  tournament.name = jsonData.name;
  $("tournamentNameTextField").value = tournament.name; // TODO -- this could be a bound configuration.
  tournament.loadRoundsFromJSON(jsonData.rounds);

  theApp.setTournament(tournament);
  stateManager.startTournament();   // TODO -- global variable

  theApp.redraw();
}
// The delegate must not be null and must implement the process method.
//
function PPFileManager(delegate) {

  if ( ! PPUtils.objectImplementsMethod( delegate, "process") ) {
     throw new Error("Process function is not implemented by delegate.");
  }

  this.delegate = delegate;
}



// TODO -- make generic
// Static class method.
PPFileManager.createFile = function (a) {

  // TODO -- does not belong here...
  var filename = $("saveFileName").value;

  // Escape encodes % but does not encode * @ etc
  // TODO test with those characters...
  var data = escape(JSON.stringify(theApp.tournament));

  a.href = "data:application/json;charset=utf-8," + data;
  a.download = filename;

}


PPFileManager.errorHandler = function (evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        PPUtils.log('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        PPUtils.log('File is not readable');
        break;
      case evt.target.error.SECURITY_ERR:
        // This will occur when loading a file and using a file:// URL.
        // Run a local http server when testing load functionality.
        //
        // python -m SimpleHTTPServer
        //
        // or run chrome with --allow-file-access-from-files
        //
        // Reference: http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18
        PPUtils.log('A Security Error occurred');

        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        PPUtils.log('An error occurred reading this file. Error code = ' + evt.target.error.code);
    };
  }

PPFileManager.load = function(e) { console.log("HERE"); }

PPFileManager.prototype.handleFileSelect = function (evt) {
  var files = evt.target.files; // FileList object
  var delegate = this.delegate;
  var f = files[0];
  var reader = new FileReader();

  reader.onerror = PPFileManager.errorHandler;
  reader.onprogress = function(e) { PPUtils.log('Progress!!'); };
  reader.onabort = function(e) { PPUtils.log('File read cancelled'); };
  reader.onload = function(e) {   delegate.process(e.target.result); };

  reader.readAsText(f);
}


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
       get: function() { return this.maxCount; },
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
        this.rounds[i][j] = PPMatch.fromObject(i, j, jsonData[i][j], this);
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

function PPCribTournament(name) {
  this.super(name);
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPCribTournament, PPTournament);

PPCribTournament.className = function () {
 return "PPCribTournament";
}

PPCribTournament.labelName = function () {
 return "Crib";
}

function PPTennisTournament(name) {
  this.super(name);
  this.class = PPTennisTournament.className();
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPTennisTournament, PPTournament);

PPTennisTournament.className = function () {
 return "PPTennisTournament";
}

PPTennisTournament.labelName = function () {
 return "Tennis";
}



// TODO -- recursive code is fun but annoying to debug in the long run...rearchitect

//
// round: a number between 0 and 5 representing the round of play.  I.E. quarter finals, finals
// position: a number representing the match number in the round
//
function PPMatch(round, position, tournament) {

  this.selected = false;

   this.winner = null;

  // exclude from JSON
  Object.defineProperty( this, 'tournament', {writable:true,configurable:true,enumerable:false});
  Object.defineProperty( this, 'position', {writable:true,configurable:true,enumerable:false});
  Object.defineProperty( this, 'round', {writable:true,configurable:true,enumerable:false});

  this.tournament = tournament;
  this.round = round;
  this.position = position;

   // All player data is stored at the first round.
  if (this.round == PPMatch.FIRST_ROUND ) {
    this.player1 = new PPPlayer("");
    this.player2 = new PPPlayer("");
  }

}

PPMatch.FIRST_ROUND = 0;
PPMatch.NO_WINNER = 0;
PPMatch.Player1 = 1;
PPMatch.Player2 = 2;

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
    return PPMatch.NO_WINNER;
  }
}

PPMatch.prototype.getWinnerName = function () {
  if ( this.winner == PPMatch.Player1 ) {
    return this.getPlayer1Name();
  }
  if ( this.winner == PPMatch.Player2 ) {
    return this.getPlayer2Name();
  }
}

PPMatch.prototype.getWinningPlayer = function () {
    if ( this.winner == PPMatch.Player1 ) {
      return this.getPlayer1();
    }
    if ( this.winner == PPMatch.Player2 ) {
      return this.getPlayer2();
    }
}

PPMatch.prototype.getLHSMatch = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    throw new Error("Not possible, there are no prior rounds.")
  }
  return this.tournament.rounds[this.round-1][this.position*2];

}

PPMatch.prototype.getPlayer1 = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    return this.player1;
  }
  var lastMatch = this.getLHSMatch();
  return lastMatch.getWinningPlayer();
}

PPMatch.prototype.getPlayer2 = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    return this.player2;
  }
  var lastMatch = this.getRHSMatch();
  return lastMatch.getWinningPlayer();
}

PPMatch.prototype.setPlayer1Name = function(name) {
  var player = this.getPlayer1();
  player.name = name;
}

PPMatch.prototype.getPlayer1Name = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    // round = round - 1
    // position = position * 2
    var lastMatch = this.getLHSMatch();
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player1.name;
}

PPMatch.prototype.setPlayer2Name = function(name) {
  var player = this.getPlayer2();
  player.name = name;
}

PPMatch.prototype.getRHSMatch = function() {
  if (this.round == PPMatch.FIRST_ROUND ) {
    throw new Error("Not possible, there are no prior rounds.")
  }
  return this.tournament.rounds[this.round-1][this.position*2 + 1];

}

PPMatch.prototype.getPlayer2Name = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    // round = round - 1
    // position = position * 2 + 1
    var lastMatch = this.getRHSMatch();
    if ( lastMatch.winner == null) {
      return "To Be Determined";
    } else {
      return lastMatch.getWinnerName();
    }
  }
  return this.player2.name;
}

PPMatch.prototype.canBePlayed = function () {
  if (this.round > PPMatch.FIRST_ROUND ) {
    return this.getLHSMatch().completed()
       && this.getRHSMatch().completed();
  }
  return true;
}



PPMatch.fromObject = function(round, position, obj, tournament) {
    var match = new PPMatch(round, position, tournament);
    match.selected = obj.selected;
    match.winner = obj.winner;
    if (round == PPMatch.FIRST_ROUND ) {
      match.setPlayer1Name(obj.player1.name);
      match.setPlayer2Name(obj.player2.name);
    }
    return match;
}// http://en.wikipedia.org/wiki/XMLHttpRequest

if (typeof XMLHttpRequest == "undefined") {
  XMLHttpRequest = function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch (e) {}
    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  };

  XMLHttpRequest.DONE = 4;
}


function PPAjaxRequest(successCallback, errorCallback) {
  if (errorCallback == null || successCallback == null) {
    throw new Error("PPAjaxRequest missing required parameter.");
  }
  this.xmlHttp = new XMLHttpRequest();

  var xmlHttp = this.xmlHttp;
  this.xmlHttp.onreadystatechange =
    function () {
       if( xmlHttp.readyState == XMLHttpRequest.DONE ) {
          if( xmlHttp.status == 200) {
            successCallback(xmlHttp);
        } else {
            errorCallback(xmlHttp);
        }
      }
    }

  }

PPAjaxRequest.prototype.getResource = function(resourceName) {
    this.xmlHttp.open("GET",resourceName, true);
    this.xmlHttp.send(null);
}
