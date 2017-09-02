
import * as constants from '../constants'

export function getTeamsSuccess( teams ) {
  // WORKS
  return {
    type: constants.actionTypes.GET_TEAMS_SUCCESS,
    teams
  };
}

export function beginSearch( searchType, message )
{
    return {
        type: constants.actionTypes.LOAD_TEAMS,
        searchType,
        message
    }
}

export function selectTeamsSuccess( gameID, gameInfo, message )
{
  return {
    type: constants.actionTypes.SELECT_TEAMS,
    gameID, 
    gameInfo, // GAME INFO - TEAMS, LOCATION, AND DATE
    message
  }
}

export function selectPlayersSuccess(player1, player2, message ) {

  return {
    type: constants.actionTypes.SELECT_PLAYERS,
    player1,
    player2,
    message    
  }
  
}