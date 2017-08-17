import { combineReducers } from 'redux';

// Reducers
import gameReducer from './gamereducer';

// Combine Reducers
var reducers = combineReducers({
    gameState: gameReducer
});

export default reducers;