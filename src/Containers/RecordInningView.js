import React, { Component } from "react";
// import PlayerAddSelectDisplay from '../Components/PlayerAddSelectDisplay'
import PitchCounter from "../Components/PitchCounter";
import _ from "lodash";
import algoliasearch from "algoliasearch";
import AtBatResult from "../Components/AtBatResult";
import store from "../store";
import { connect } from "react-redux";

const NEW_INNING_VIEW = "NEW_INNING_VIEW";
const INNING_IN_PLAY_VIEW = "INNING_IN_PLAY_VIEW";

var stateObject = {
  currentPitcher: {}, // ALGOLIA OBJECT - ["playerFirstName", "playerLastName", "isPitcher", "playerAge"]
  homeTeam: {},
  awayTeam: {},
  currentBatter: "Bilbo Ballguns",
  currentBatterID: 834867640, // ALGOLIA ID ... HAVEN'T IMPLEMENTED SELECTING A BATTER YET
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
    this.endInning = this.endInning.bind(this);
    this.state = stateObject;
    // this.modifyPitch = this.modifyPitch.bind(this)
    this.addNewPitch = this.addNewPitch.bind(this);
    this.handleSelectPitcher = this.handleSelectPitcher.bind(this);

    this.handleSelectPitcher(this.props);
  }

  handleSelectPitcher(props) {
    // THIS METHOD IS CALLED AFTER SELECTING TEAM AND PLAYER IS COMPLETE IN PITCHER DISPLAY
    this.setState({
      currentPitcher: props.currentPlayer,
      currentTeamID: props.currentTeamID,
      currentTeamName: props.currentTeamName
    });

    // OBJECT IN PROPS (PITCHER DISPLAY STATE OBJECT)
    // {
    // showAddPlayer: false,
    // viewState: "PlayerAddSelectDisplay",
    // teams: [],
    // players: [],
    // currentTeamID: 0,
    // currentTeamName: "",
    // currentPlayer: {}
    //  }
  }

  addNewPitch(e) {
    e.preventDefault();

    if (!this.state.currentPitcher.playerFirstName) {
      alert("Select a Pitcher First!");
      return;
    }

    var newPitch = {
      type: "pitch", // RECORD TYPE FOR ALGOLIA SEARCHES
      pitchType: "", // TODO: ALLOW FOR PITCHTYPE MODS
      inning: this.state.currentInning,
      pitchResult: e.target.id,
      opposingPlayer: this.state.currentBatterID, // ALGOLIA ID
      pitcher: this.state.currentPitcher.objectID // ALGOLIA ID
    };

    var statePitchArray = this.state.pitchesThisInning;

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
    else return 0;
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

  /**
    * 
    * This runs when an "end inning action" button is clicked
    * on the AtBatResult component
    * @param {event} e 
    * 
    * @memberOf GameView
    */
  endInning(e) {
    e.preventDefault();
    console.log("endinginning! result: " + e.target.id);
  }

  render() {
    // TODO...
    // IMPLEMENT END-INNING
    return (
      <div className="grid-container">
        <div className="grid-x cell">
          <span className="cell">Inning: 1 Outs:1</span>
          <span className="cell">Pitcher: { this.props.storeState.currentPitcher} </span>
        </div>

        <div className="grid-x cell small-12 align-center pitcher-counts">
          <div className="cell small-4">{this.countStrikes()} Strikes</div>
          <div className="cell small-4">{this.countTotal()} Total</div>
          <div className="cell small-4">{this.countBalls()} Balls</div>
        </div>

        <PitchCounter addNewPitch={this.addNewPitch} />
        <AtBatResult endInning={this.endInning} />
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
