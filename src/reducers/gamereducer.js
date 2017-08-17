import * as types from '../constants';
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
        viewState: ""
      };

const gameReducer = function(state = initialState, action) {

  // WORKS  
  switch(action.type) {
    case types.GET_TEAMS_SUCCESS:
      // console.log( "THIS REDUCER HAS GOTTEN THE MESSAGE ....")
      return Object.assign({}, state, { teams: action.teams });
    case types.SELECT_TEAMS:
      console.log ( ` home team: ${action.homTeam} game id: ${action.gameID} actionbody: ${action} `)
      return Object.assign( {}, state, { homeTeam: action.homeTeam, awayTeam: action.awayTeam, gameID: action.gameID }) 



    // case types.DELETE_USER_SUCCESS:

    //   // Use lodash to create a new user array without the user we want to remove
    //   const newUsers = _.filter(state.users, user => user.id != action.userId);
    //   return Object.assign({}, state, { users: newUsers });

    // case types.USER_PROFILE_SUCCESS:
    //   return Object.assign({}, state, { userProfile: action.userProfile });
    default:
    return state;

  }

}

export default gameReducer;
