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