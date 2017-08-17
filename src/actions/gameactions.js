
import * as types from '../constants'

export function getTeamsSuccess( teams ) {
  // WORKS
  return {
    type: types.GET_TEAMS_SUCCESS,
    teams
  };
}

export function beginSearch( searchType, message )
{
    return {
        type: types.LOAD_TEAMS,
        searchType,
        message
    }
}

export function selectTeamsSuccess( teams, gameID, message )
{
  return {
    type: types.SELECT_TEAMS,
    teams, // ARRAY OF THE TWO COMPETING TEAMS
    gameID,
    message
  }
}