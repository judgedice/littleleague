
import * as constants from '../constants'

export function getTeamsSuccess( teams, message ) {
  // WORKS
  return {
    type: constants.actionTypes.GET_TEAMS_SUCCESS,
    teams,
    message
  };
}

export function getPlayersSuccess( teamID, players, message ){
  return {
    type: constants.actionTypes.GET_PLAYERS_SUCCESS,
    teamID,
    players,
    message
  }
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

export function selectPlayersSuccess( pitcher, batter, message ) {

  return {
    type: constants.actionTypes.SELECT_PLAYERS,
    pitcher,
    batter,
    message    
  }
  
}

