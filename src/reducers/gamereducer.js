import * as constants from "../constants";
// import _ from 'lodash';

const initialState = {
  homeTeam: {
    teamName: "",
    objectID: 0,
    currentScore: 0
  },
  awayTeam: {
    teamName: "",
    objectID: 0,
    currentScore: 0
  },
  teams: [],
  gameID: 0,
  currentPitcherName: "",
  currentAtBatName: "",
  currentInning: 1,
  currentOutCount: 0,
  location: "",
  teamsSelected: false,
  viewState: "SELECT_LOCATION_TEAMS_VIEW"
};

const gameReducer = function(state = initialState, action) {
  // WORKS
  switch (action.type) {
    case constants.actionTypes.GET_TEAMS_SUCCESS:
      // console.log( "THIS REDUCER HAS GOTTEN THE MESSAGE ....")
      return Object.assign({}, state, { teams: action.teams });
    case constants.actionTypes.SELECT_TEAMS:
      return Object.assign({}, state, {
        homeTeam: action.gameInfo.homeTeam,
        awayTeam: action.gameInfo.awayTeam,
        gameID: action.gameID, 
        teamsSelected: true,
        viewState: constants.viewStates.SELECT_PLAYERS_VIEW
      });
      case constants.actionTypes.SELECT_PLAYERS:
      console.log( "inside gamereducer... pitcher name: " + action.player1 )
      return Object.assign({}, state, {
       currentPitcherName: action.player1,
       currentAtBatName: action.player2,
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
