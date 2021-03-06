import React, { Component } from "react";
// import PlayerAddSelectDisplay from '../Components/PlayerAddSelectDisplay'
import PitchCounter from "../Components/PitchCounter";
import _ from "lodash";
import algoliasearch from "algoliasearch";
import AtBatResult from "../Components/AtBatResult";
import store from "../store";
import { connect } from "react-redux";
import PlayerAddSelectDisplay from "../Components/PlayerAddSelectDisplay";
import {selectPlayers} from '../actions/gameactions';

const NEW_INNING_VIEW = "NEW_INNING_VIEW";
const INNING_IN_PLAY_VIEW = "INNING_IN_PLAY_VIEW";

var stateObject = {
  homeTeam: {},
  awayTeam: {},
  currentInning: 1,
  pitchesThisInning: [], // array of all pitch objects just for the inning
  pitchInQueue: {}, // single pitch object that can be modified
  viewState: INNING_IN_PLAY_VIEW
};

// ALGOLIA SETUP ... NEED TO ELIMINATE THIS API KEY AS IT IS PUBLISHED AND ADMIN
const client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");

class RecordInningView extends Component {
  constructor(props, context) {
    super(props, context);
    this.endInning = this.endAtBat.bind(this);
    this.state = stateObject;

    this.addNewPitch = this.addNewPitch.bind(this);

  }

  componentWillMount() {}


  addNewPitch(e) {
    e.preventDefault();
    var statePitchArray = this.state.pitchesThisInning;

    // REMOVE PITCH
    if (e.target.id === "remove") {
      // THERE'S NO PITCH IN QUEUE...
      if (!this.state.pitchInQueue.gameDate) {
        statePitchArray.pop();
        this.setState({ pitchesThisInning: statePitchArray });
      } else {
        this.setState({ pitchInQueue: {} });
      }
      return;
    }

    var newPitch = {
      type: "pitch", // RECORD TYPE FOR ALGOLIA SEARCHES
      pitchType: "", // TODO: ALLOW FOR PITCHTYPE MODS
      inning: this.props.storeState.currentInning,
      pitchResult: e.target.id,
      opposingPlayer: this.props.storeState.currentBatter.objectID, // ALGOLIA ID
      pitcher: this.props.storeState.currentPitcher.objectID, // ALGOLIA ID
      gameDate: this.props.storeState.gameDate
    };

    if (!this.state.pitchInQueue.gameDate) {
      this.setState({ pitchInQueue: newPitch });
      return;
    }

    if (!statePitchArray.length) {
      statePitchArray = [this.state.pitchInQueue];
    } else {
      statePitchArray.push(this.state.pitchInQueue);
    }
    this.setState({
      pitchesThisInning: statePitchArray,
      pitchInQueue: newPitch
    });
  }

  //TODO...
  // * HANDLE CHANGE BATTER, PITCHER, INNING

  endInning() {
    // TODO...
    // 1. INCREMENT INNING PROPERTY IN STATE
    // 2. REMOVE PITCHCOUNTER COMPONENT
    // 3. INSTANTIATE NEW PITCHCOUNTER COMPONENT (PITCHERVIEW??) WITH NEW PLAYERS
    // 4. ROTATE PLAYERS, LINEUPS

    // 1. WRITE PITCHES TO ALGOLIA
    // 2. END INNING WITH PARENT COMPONENT

    // TODO:
    // ALL THIS GOES TO GAMEVIEW

    var inning = this.state.currentInning + 0.5;
    var newPitchArray = this.state.pitchesThisInning;
    newPitchArray.push(this.state.pitchInQueue);
    var index = client.initIndex("little_league_stats");
    // MOVE THIS TO ALGOLIA METHODS
    index.addObjects(
      newPitchArray,
      function() {
        this.setState({
          pitchesThisInning: [],
          currentInning: inning,
          pitchInQueue: {},
          viewState: NEW_INNING_VIEW
        });
      }.bind(this)
    );
  }

  /**
   * Count total pitches for current inning
   * 
   * @returns 
   * 
   * @memberOf RecordInningView
   */
  countTotal() {
    if (this.state.pitchInQueue.gameDate)
      return this.state.pitchesThisInning.length + 1;
    else return this.state.pitchesThisInning.length;
  }

  /**
   *  Count pitches that are recored as Strikes
   * 
   * @returns 
   * 
   * @memberOf RecordInningView
   */
  countStrikes() {
    if (this.state.pitchInQueue.pitchResult === "strike")
      return (
        _.filter(this.state.pitchesThisInning, { pitchResult: "strike" })
          .length + 1
      );
    else
      return _.filter(this.state.pitchesThisInning, { pitchResult: "strike" })
        .length;
  }

  /**
   * Count pitches that are recorded as Balls
   * 
   * @returns 
   * 
   * @memberOf RecordInningView
   */
  countBalls() {
    if (this.state.pitchInQueue.pitchResult === "ball")
      return (
        _.filter(this.state.pitchesThisInning, { pitchResult: "ball" }).length +
        1
      );
    else
      return _.filter(this.state.pitchesThisInning, { pitchResult: "ball" })
        .length;
  }
  
  setPitcherState = ( prop ) => {
    store.dispatch(
      selectPlayers(
        prop,
        this.props.storeState.currentBatter,
        `Pitcher Changed! New Pitcher: {prop.playerName}`
      )
    )
  }

  setBatterState = ( prop ) => {
    store.dispatch(
      selectPlayers(
        this.props.storeState.currentPitcher,
        prop,
        `Batter Changed! New Batter: {prop.playerName}`
      )
    )
  }

  /**
    * 
    * This runs when an "end inning action" button is clicked
    * on the AtBatResult component
    * @param {event} e 
    * 
    * @memberOf GameView
    */
  endAtBat(e) {
    e.preventDefault();
    // TODO:
    // 1. CHANGE BATTERS
    // 2. SAVE INNING DATA
    // 3. THAT'S IT! DON'T FORGET OFFLINE FIRST!

    // console.log("endinginning! result: " + e.target.id);
  }

  render() {
    // TODO...
    // IMPLEMENT END-INNING
    return (
      <div className="auto cell grid-y grid-x fluid">
        <div id="jsxPitcherName" className="grid-x cell text-center">
          <span className="cell small-12 medium-12 large-12 font-italic">
            Inning: 1 Outs:2
          </span>
          <span className="cell pitcher-row">
            <PlayerAddSelectDisplay
              playerType={"Pitcher"}
              player={this.props.storeState.currentPitcher}
              team={this.props.storeState[this.props.storeState.teamInField]}
              selectPlayer={this.setPitcherState}
            />
          </span>
        </div>

        <div className="grid-x auto cell small-12 align-center ">
          <div className="cell grid-x small-12 pitcher-counts">
            <div className="cell small-4 pitcher-stat">
              <p className="vertical-middle"> {this.countStrikes()} Strikes </p>
            </div>
            <div className="cell small-4 pitcher-stat total">
              <p className="vertical-middle"> {this.countTotal()} Total</p>
            </div>
            <div className="cell small-4 pitcher-stat">
              <p className="vertical-middle"> {this.countBalls()} Balls</p>
            </div>
          </div>

          <div className="grid-x cell small-12 align-center pitch-count-buttons-container">
            <PitchCounter addNewPitch={this.addNewPitch} />
          </div>
        </div>

        <div className="cell text-center batter-row">
          <PlayerAddSelectDisplay
            playerType={"Batter"}
            player={this.props.storeState.currentBatter}
            team={this.props.storeState[this.props.storeState.teamAtBat]}
            selectPlayer={this.setBatterState}
          />
        </div>
        <AtBatResult endAtBat={this.endAtBat} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    storeState: store.gameState
  };
};

export default connect(mapStateToProps)(RecordInningView);

// export default RecordInningView;
