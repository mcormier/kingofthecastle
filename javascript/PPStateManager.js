// States:
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
