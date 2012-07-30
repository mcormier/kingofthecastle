     "use strict";
     // Requires:
     // ECMAScript 5
     // HTML 5 Canvas support
     // HTML 5 <a> download attribute
     // HTML 5 FileReader

     // TODO -- support the concept of a pass
     // TODO -- WeeWeekly tournament with a consolation round.
     // TODO -- save score and track a withdrawal
     // TODO -- link suggested download name to title
     // TODO -- fix tab order when inputting player names
     // TODO -- support doubles matches
     // TODO -- reexamine drawing code.  I.E. calling begin path to clear is questionable.
     // TODO -- round and position of a match do not need to be saved, can be derived.

     // TODO -- remove the constraint that a player can only be edited at the first round level. This is annoying to a user and not helpful.  UI should not reflect the underlying datamodel.

      // 2 rounds = 4 players
      // 3 rounds = 8 players
      // 4 rounds = 16 players
      // 5 rounds = 32 players
      // 6 rounds = 64 players


     function handlePlayerNumberCombo(combo) {
       var selIndex = combo.selectedIndex;

       initializeData(selIndex);
       canvasView.redraw();
     }

     function initializeData(selIndex) {
       // Player number = 2 to the power of (selIndex + 2)
       // (0,1,2,3,4) ==> (4,8,16,32,64)
       tournament.createBlankData(Math.pow(2,selIndex + 2));
     }


     function handleCanvasClick(e) {
       canvasView.handleClick(e);
       return false;
     }


     function handleFileSelect(evt) {
       fileManager.handleFileSelect(evt);
     }

      window.onload = function() {

        PPUtils.bind("change", "fileLoader", handleFileSelect);
        PPUtils.bindTextField("keyup", "tournamentNameTextField", tournament, "titleChanged");
      };

     // Global variables.
     var tournamentLoader = new PPTournamentLoader();
     var fileManager = new PPFileManager(tournamentLoader);
     var tournament;
     var canvasView;
     var stateManager = new PPStateManager();
     var editController;


     //  Register tournament types
     tournamentLoader.registerTournamentTypes( [PPCribTournament, PPTennisTournament] );

     // BEGIN StateManager Hook functions -----------------------------------------------------------
     function stateBeginHook() { /* TODO -- never called */ }
     function stateChooseTournamentHook() {
     }
     function stateLoadTournamentHook() {  }
     function stateConfigureTournamentHook() {
       tournament = tournamentLoader.getSelectedTournamentType();
       canvasView = new PPCanvasView(tournament);
       var canvas = $("myCanvas");
       canvasView.setCanvas(canvas);
       canvas.onclick = handleCanvasClick;
       editController = new PPEditController(tournament)
       // Setup listeners.
       tournament.addSelectedMatchListener(editController);

       initializeData($("numberOfPlayersCombo").selectedIndex);
       canvasView.redraw();
     }
     function stateStartTournamentHook() {
          showElement($("tournamentTitle"));

          editController.disablePlayerTextFields(true);
          editController.disableWinnerRadioButtons(true);
     }
     // END StateManager Hook functions -----------------------------------------------------------

     stateManager.linkDivsAndHooksToStates(
       ["begin", "chooseTournamentType", "configureTournament", "matchEditor", "loadTournament"],
       [stateBeginHook, stateChooseTournamentHook, stateConfigureTournamentHook, stateStartTournamentHook, stateLoadTournamentHook],
       [PPState.START, PPState.CHOOSE_TOURNAMENT, PPState.CONFIGURE_TOURNAMENT, PPState.START_TOURNAMENT, PPState.LOAD_TOURNAMENT] );


