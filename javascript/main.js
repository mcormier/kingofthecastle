     "use strict";
     // Requires:
     // ECMAScript 5
     // HTML 5 Canvas support
     // HTML 5 <a> download attribute
     // HTML 5 FileReader

     // TODO -- support the concept of a pass/bye
     // TODO -- WeeWeekly tournament with a consolation round.
     // TODO -- save score and track a withdrawal
     // TODO -- link suggested download name to title
     // TODO -- support doubles matches
     // TODO -- reexamine drawing code.  I.E. calling begin path to clear is questionable.

      // 2 rounds = 4 players
      // 3 rounds = 8 players
      // 4 rounds = 16 players
      // 5 rounds = 32 players
      // 6 rounds = 64 players


     function handlePlayerNumberCombo(combo) {
       var selIndex = combo.selectedIndex;

       initializeData(selIndex);
       theApp.redraw();
     }

     function isDoubles() {
       console.log("TODO -- support doubles");
     }

     function initializeData(selIndex) {
       // Player number = 2 to the power of (selIndex + 2)
       // (0,1,2,3,4) ==> (4,8,16,32,64)
       theApp.tournament.createBlankData(Math.pow(2,selIndex + 2));
     }

     function handleFileSelect(evt) {
       fileManager.handleFileSelect(evt);
     }

      window.onload = function() {

        PPUtils.bind("change", $("fileLoader"), handleFileSelect);
        PPUtils.bindTextField("keyup", $("tournamentNameTextField"), theApp, "titleChanged");
        tournamentLoader.generateRadioList("tournamentTypeList");
      };

     // Global variables.
     var theApp = new PPApplication(new PPEditController(), new PPCanvasView("tournamentCanvas") );
     var tournamentLoader = new PPTournamentLoader();
     var fileManager = new PPFileManager(tournamentLoader);
     var stateManager = new PPStateManager();


     //  Register tournament types
     tournamentLoader.registerTournamentTypes( [PPTennisTournament, PPCribTournament] );

     // BEGIN StateManager Hook functions -----------------------------------------------------------
     function stateBeginHook() { }
     function stateChooseTournamentHook() {
     }
     function stateLoadTournamentHook() {  }
     function stateConfigureTournamentHook() {
       var tournament = tournamentLoader.getSelectedTournamentType();
       var selIndex  = $("numberOfPlayersCombo").selectedIndex;
       tournament.createBlankData(Math.pow(2,selIndex + 2));

       theApp.setTournament(tournament);
       theApp.redraw();
     }
     function stateStartTournamentHook() {
          showElement($("tournamentTitle"));

          theApp.editController.disablePlayerTextFields(true);
          theApp.editController.disableWinnerRadioButtons(true);
     }
     // END StateManager Hook functions -----------------------------------------------------------

     stateManager.linkDivsAndHooksToStates(
       ["begin", "chooseTournamentType", "configureTournament", "matchEditor", "loadTournament"],
       [stateBeginHook, stateChooseTournamentHook, stateConfigureTournamentHook, stateStartTournamentHook, stateLoadTournamentHook],
       [PPState.START, PPState.CHOOSE_TOURNAMENT, PPState.CONFIGURE_TOURNAMENT, PPState.START_TOURNAMENT, PPState.LOAD_TOURNAMENT] );


