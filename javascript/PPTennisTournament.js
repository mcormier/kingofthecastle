function PPTennisTournament(name) {
  this.super(name);
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPTennisTournament, PPTournament);

PPTennisTournament.typeName = function () {
 return "Tennis";
}

