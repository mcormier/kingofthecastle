function PPTournament(name, isDoubles) {
  this.setName(name);
  this.doubles = isDoubles;

  // A 2 sided array stores all our match data
  this.rounds =  [ new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

  Object.defineProperty( this, 'selectedMatch', {
       get: function() { return this.selectedMatchValue; },
       set: function(newValue) {  this.selectedMatchValue = newValue;
                                  PPUtils.notifyListeners(this.selectedMatchListeners, "selectMatch", this.selectedMatch);
                               },
       configurable:true,
       enumerable:false  // exclude from JSON
  });

 Object.defineProperty( this, 'maxPlayerCount', {
       get: function() { return this.maxCount; },
       set: function(newValue) {  this.maxCount = newValue;
                                  PPUtils.notifyListeners(this.playerCountListeners, "maxPlayerCountChanged", this.maxCount);
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
PPTournament.prototype.setName = function (value) {
  if (value == null ) { this.name = ""; } else this.name = value; }

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

  console.log("TODO -- loadRoundsFromJSON check if this is doubles...");

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

PPTournament.prototype.titleChanged = function (element, evt) {
    this.name = element.value;
}


PPTournament.prototype.setMaxNumberOfPlayers = function (maxPlayerNumber) {

}

// The number of rounds is the number of arrays in our two
// sided rounds array that have 1 or more matches.
PPTournament.prototype.numberOfRounds = function () {
  for( var i = 0; i < this.rounds.length; i ++) {
    if (this.rounds[i].length == 0) { break; }
  }
  return i;
}

// Returns the number of matches that need to be played
// for a round.
PPTournament.prototype.matchesForRound = function (round) {
   return this.rounds[round].length;
}

PPTournament.prototype.createBlankData = function (playerNumber) {
  if (playerNumber < 4) {
    throw Error("Invalid input");
  }
  this.clearRounds();

  // If the player number is not a power of 2 then
  // determine the next power of 2 and use that.  For example,
  // if there are only 5 players then you will need to setup
  // 8 matches but 3 of those matches will have byes defined instead
  // of an actual player
  if( ! PPUtils.isPowerOf2(playerNumber) ) {
    this.maxPlayerCount = Math.pow(2, Math.ceil(Math.log(playerNumber)/Math.log(2)));
   }  else {
    this.maxPlayerCount = playerNumber;
  }

  var rnd = 0;
  for(var x = this.maxPlayerCount/2; x >= 1; x = x/2 ) {
    for (var i = 0; i < x; i++) {
      var match;
      if (this.isDoubles) {
        match = new PPDoublesMatch(rnd, i, this);
      }
      else {
        match = new PPMatch(rnd, i, this);
      }
      this.rounds[rnd].push( match );
    }
    rnd++;
  }


}