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


