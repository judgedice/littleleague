import React, { Component } from "react";
// import PropTypes from "prop-types";
import { GameScore } from "../Components/SubComponents/GameScore";
import Collapsible from "react-collapsible";
import RecordInningView from "../Containers/RecordInningView";
import GameSetupRecord from "../Components/GameSetupRecord";
// import PlayerAddSelectDisplay from "../Components/PlayerAddSelectDisplay";
// import store from "../store";
// import { selectTeamsSuccess } from "../actions/gameactions";
// import * as api from "../api/algoliamethods";
import * as constants from "../constants";
import { connect } from "react-redux";
// import { selectPlayers } from "../actions/gameactions";

class GameView extends Component {
  constructor(props) {
    super(props);

    // // INITIAL STATE
    this.state = {
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
      currentInning: 1,
      currentOutCount: 0,
      location: "",
      viewState: constants.viewStates.SETUP_GAME_VIEW,
      teamsSelected: false,
      temporaryGameObject: {}
    };
  }

  // UTILITY METHODS

  // EVENT HANDLERS

 
  componentDidMount() {}

  render() {
    // let collapseTrigger = <div>View Game Stats for {this.state.homeTeam.name}</span></div>

    function collapseTrigger(prop = "No Teams Selected") {
      return <span>View Game Stats for {prop}</span>;
    }

    // if ( this.state.currentInning === 0 && ( !this.state.homeTeam && !this.state.awayTeam ) ) showEditLink = "";
    var  showView = () => {
      switch (this.props.storeState.viewState) {
        case constants.viewStates.SETUP_GAME_VIEW:
          return ( "" );
        case constants.viewStates.SELECT_GAME_VIEW:
          break;

        case constants.viewStates.QUICK_RECORD_VIEW:
          break;
        case constants.viewStates.RECORD_GAME_VIEW:
          return (
              ""
          );
        case constants.viewStates.DEFAULT_GAME_VIEW:
          return (
            <div className="cell">
              <div className="cell callout small-10 align-center text-center">
                <span className="cell">
                  Now Pitching: { /* this.state.currentPitcherName*/ }
                </span>
              </div>
              <GameScore
                team1={this.state.homeTeam.name}
                score1={this.state.homeTeam.currentScore}
                team2={this.state.awayTeam.name}
                score2={this.state.awayTeam.currentScore}
              />
              <div className="grid-x large-10 small-10 align-center cell callout primary text-center">
                <span className="cell small-5">
                  INNING : {this.state.currentInning}
                </span>
                <span className="cell small-2" />
                <span className="cell small-5">
                  OUTS: {this.state.currentOutCount}
                </span>
              </div>
              <div className="cell small-10 align-center">
                <Collapsible
                  trigger={collapseTrigger(this.state.homeTeam)}
                  transitionTime={100}
                >
                  <p>
                    This is the collapsible content. It can be any element or
                    React component you like.
                  </p>
                  <p>
                    It can even be another Collapsible component. Check out the
                    next section!
                  </p>
                </Collapsible>
              </div>
            </div>
          );
        default:
          return <div> nothing </div>;
      }
    }

    return (
      <div id="GameView" className="grid-y grid-frame">
        <GameSetupRecord >
        { showView() }
        </GameSetupRecord>
      </div>
    );

  }
}

const mapStateToProps = function(store) {
  return {
    storeState: store.gameState
  };
};

export default connect(mapStateToProps)(GameView);
