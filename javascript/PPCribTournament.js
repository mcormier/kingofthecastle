function PPCribTournament(name) {
  this.super(name);
}

// This must be in between the constructor definition and
// new method definitions in order for it to work.
PPUtils.extend (PPCribTournament, PPTournament);

PPCribTournament.typeName = function () {
 return "Crib";
}

