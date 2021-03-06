import algoliasearch from "algoliasearch";
import store from "../store";
import {
  getTeamsSuccess,
  selectTeams,
  getPlayersSuccess, 
  beginSearch
} from "../actions/gameactions";

// ALGOLIA SETUP ... NEED TO ELIMINATE THIS API KEY AS IT IS PUBLISHED AND ADMIN
const client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");

export function searchTeams() {
  // if (this.state.teams.length) return; // TODO... DON'T CRASH APP IF THIS HAPPENS
  //this.setState( { viewState: "teamSelect" } )
  // console.log( "searching teams")
  store.dispatch( beginSearch("teams", "Searching for Teams with Data Provider"));
  var index = client.initIndex("little_league_teams");
  index
    .search("", {
      hitsPerPage: "100",
      page: "0",
      attributesToRetrieve: ["teamName", "objectID", "teamCoach"],
      facets: "[]"
    })
    .then(response => {
      store.dispatch(getTeamsSuccess(response.hits));
    });

  // return (<div>getting teams</div>)
}

export function getPlayersByTeam(teamID) {
  var index = client.initIndex("little_league_players");
  var filterString = `('playerTeamID':${teamID} )`;
  index
    .search("", {
      hitsPerPage: "100",
      filters: filterString,
      attributesToRetrieve: [
        "playerFirstName",
        "playerLastName",
        "isPitcher",
        "playerAge",
        "objectID"
      ]
      //"facets": "[]"
    })
    .then(response => {
      store.dispatch(
        getPlayersSuccess(
          teamID,
          response.hits,
          "Players have been returned from the service"
        )
      );
    });
}

export function updateAddGameData(gameObject) {
  var index = client.initIndex("little_league_games");
  // TODO... MOVE THIS API CALL TO THE SERVER TO HIDE THE ADMIN API FROM ALGOLIA

  // TRANSLATING FULL GAME OBJECT TO JUST STORE ID'S IN ALGOLIA
  var tempObject = {
    homeTeam: gameObject.homeTeam.objectID,
    awayTeam: gameObject.awayTeam.objectID,
    location: gameObject.location,
    date: gameObject.date
  };

  var tempStore = store.getState();
  
  var sendMessageAndGetPlayers = response => {
    store.dispatch(
      selectTeams(response.objectID, gameObject, "Game Saved to Cloud")
    );
    getPlayersByTeam( gameObject.homeTeam.objectID );
    getPlayersByTeam( gameObject.awayTeam.objectID );
  
  };

  if (tempStore.gameState.gameID !== 0) {
    // UPDATE GAME
    index.saveObject({
        homeTeam: gameObject.homeTeam.objectID,
        awayTeam: gameObject.awayTeam.objectID,
        location: gameObject.location,
        date: gameObject.date,
        objectID: tempStore.gameState.gameID
      })
      .then(response => {
        sendMessageAndGetPlayers(response);
      });
    return;
  }
  // NO GAME STORED YET, ADD ONE TO ALGOLIA 
  index.addObject(tempObject).then(response => {
    sendMessageAndGetPlayers(response);
  });


}
