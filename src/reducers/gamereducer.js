import * as constants from "../constants";
// import _ from 'lodash';

const initialState = {
  homeTeam: {
    teamName: "",
    objectID: 0,
    currentScore: 0,
    players: []
  },
  awayTeam: {
    teamName: "",
    objectID: 0,
    currentScore: 0,
    players: []
  },
  teams: [],
  
  gameID: 0,
  gameDate: "",
  currentPitcherName: "",
  currentAtBatName: "",
  currentPitcher: {},
  currentBatter: {},
  currentInning: 1,
  currentOutCount: 0,
  location: "",
  teamsSelected: false,
  viewState: constants.viewStates.SETUP_GAME_VIEW
};

const gameReducer = function(state = initialState, action) {
  switch (action.type) {
    case constants.actionTypes.GET_TEAMS_SUCCESS:
      // console.log( "THIS REDUCER HAS GOTTEN THE MESSAGE ....")
      return Object.assign({}, state, { teams: action.teams });


    case constants.actionTypes.SELECT_TEAMS:
      return Object.assign({}, state, {
        homeTeam: action.gameInfo.homeTeam,
        awayTeam: action.gameInfo.awayTeam,
        gameID: action.gameID,
        gameDate: action.gameInfo.date,
        teamsSelected: true
      });


    case constants.actionTypes.GET_PLAYERS_SUCCESS: // LIST OF PLAYERS BY TEAM RETRIEVED
      // TODO... ALGOLIA SENDS "HIGHLIGHTED RESULTS", WHICH WE DON'T NEEED
      var teamString = "";
      if (action.teamID === state.homeTeam.objectID) teamString = "homeTeam";
      else teamString = "awayTeam";
      var tempTeamObject = state[teamString];
      tempTeamObject.players = action.players;
      return Object.assign({}, state, {
        [teamString]: tempTeamObject
          //viewState: constants.viewStates.RECORD_GAME_VIEW // DON'T CHANGE VIEWSTATE JUST YET
      });

      
    case constants.actionTypes.SELECT_PLAYERS:
      // console.log( "inside gamereducer... pitcher name: " + action.player1 )
      return Object.assign({}, state, {
        currentPitcherName: action.pitcherName,
        currentAtBatName: action.batterName,
        currentPitcher: action.pitcherObject,
        currentBatter: action.batterObject,
        viewState: constants.viewStates.RECORD_GAME_VIEW
      });

    // case actionTypes.actionTypes.DELETE_USER_SUCCESS:

    //   // Use lodash to create a new user array without the user we want to remove
    //   const newUsers = _.filter(state.users, user => user.id != action.userId);
    //   return Object.assign({}, state, { users: newUsers });

    // case actionTypes.actionTypes.USER_PROFILE_SUCCESS:
    //   return Object.assign({}, state, { userProfile: action.userProfile });
    default:
      return state;
  }
};

export default gameReducer;
