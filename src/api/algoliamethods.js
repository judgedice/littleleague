import algoliasearch from "algoliasearch";
import store from "../store";
import { getTeamsSuccess, selectTeamsSuccess } from "../actions/gameactions";

// ALGOLIA SETUP ... NEED TO ELIMINATE THIS API KEY AS IT IS PUBLISHED AND ADMIN
const client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");

export function searchTeams() {
  // if (this.state.teams.length) return; // TODO... DON'T CRASH APP IF THIS HAPPENS
  //this.setState( { viewState: "teamSelect" } )
  // console.log( "searching teams")
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

export function addNewGameData(gameObject) {
  var index = client.initIndex("little_league_games");
  // TODO... MOVE THIS API CALL TO THE SERVER TO HIDE THE ADMIN API FROM ALGOLIA

  index.addObject(
    gameObject ).then( response => {
        store.dispatch( selectTeamsSuccess( response.objectID, gameObject ))
    });
}
