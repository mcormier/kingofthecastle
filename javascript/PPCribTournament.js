function PPCribTournament(name) {
  this.superclass(name);
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

