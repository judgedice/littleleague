import React, { Component } from "react";
// import algoliasearch from "algoliasearch";
import TeamSelector from "./SubComponents/TeamSelector";
import store from "../store";
import * as api from "../api/algoliamethods";
import * as constants from "../constants";
import _ from "lodash";
import { connect } from "react-redux";
import {  selectPlayers } from "../actions/gameactions";
import PlayerAddSelectDisplay from "./PlayerAddSelectDisplay";
import RecordInningView from '../Containers/RecordInningView';

// TODO: VERIFY HOW WE HANDLE TEAMS AS A STATE OF JUST THIS COMPONENT
// IS THIS THE MOST EFFICIENT WAY?

class GameSetupRecord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      teamsSelected: false,
      showPlayers: false,
      location: "",
      currentPitcher: {},
      currentBatter: {},
      playersSelected: false,
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
      }
    };
    this.handleTeamSelection = this.handleTeamSelection.bind(this);
    // this.handleLocationFieldChange = this.handleLocationFieldChange.bind(this);
    this.setPlayerStates = this.setPlayerStates.bind(this);
    this.saveInitialGameData = this.saveInitialGameData.bind(this);
    this.setupComplete = this.setupComplete.bind(this);
  }
  componentDidMount() {
    api.searchTeams();
  }

  // EVENT HANDLERS

  handleTeamSelection(e) {
    e.preventDefault();
    var teamObj = _.filter(this.props.storeState.teams, {
      objectID: e.target.value
    });
    // console.log( this + " team array:  " + this.props.teams )
    this.setState({ [e.target.id]: teamObj[0] }, this.handleTeamStateSetting);
    // this.props.handleTeamSelect(teamObj[0], e.target.id); // THE TEAMOBJECT IS GOING TO BE A 1 ITEMED ARRAY
  }

  handleTeamStateSetting() {
    if (
      this.state.homeTeam.objectID !== 0 &&
      this.state.awayTeam.objectID !== 0 &&
      this.state.location.length > 3
    ) {
      var gameObject = {
        homeTeam: this.state.homeTeam,
        awayTeam: this.state.awayTeam,
        location: this.state.location,
        date: new Date().toDateString()
      };
      this.saveInitialGameData(gameObject);
      // this.setState({ temporaryGameObject: gameObject, teamsSelected: true }, this.saveInitialGameData );
    }
  }

  /**
   * 
   * 
   * @param {any} e 
   * 
   * @memberOf LocationsTeamSelector
   */

  saveInitialGameData(gameObject) {
    api.updateAddGameData(gameObject);
  }

  setPlayerStates(prop) {
    // console.log(" GameView, setting player states: " + prop.isPitcher);
    if (prop.isPitcher) {
      this.setState(
        {
          currentPitcher: prop
        },
        this.handlePlayersSet
      );
    } else
      this.setState(
        {
          currentBatter: prop
        },
        this.handlePlayersSet
      );
  }

  handlePlayersSet() {
    if (
      this.state.currentBatter.playerFirstName &&
      this.state.currentPitcher.playerFirstName
    ) {
      this.setState({ playersSelected: true });
    }
  }

  setupComplete() {
    // PITCHER FIRST, THEN BATTER, ALWAYS
    store.dispatch(
      selectPlayers(
        this.state.currentPitcher,
        this.state.currentBatter,
        "Players Selected, PLAY BALL!"
      )
    );
    // store.setState( {currentPitcherName: this.state.currentPitcherName, currentAtBatName:this.state.currentAtBatName})
    // console.log("players are set ");
  }

  handleLocationFieldChange = (e) => {
    // MIGHT HAVE A RACE CASE HERE... IF USER SELECTS PLAYERS REAL FAST AND CLICKS GO
    this.setState({ location: e.target.value }, this.handleTeamStateSetting);
  }

  render() {
    function showEditLink() {
      if (this.props.storeState.currentInning === 1) return "";
      else return <a href="#record">Record Next Inning</a>;
    }

    const GameHeader = props => {
      return (
        <div id="GameHeader" className="cell grid-x">
          <div className="cell grid-x text-center small-12 large-12 medium-12">
            <div className="cell small-4 large-4 medium-4">
              <h1 className="">{this.state.homeTeam.teamName}</h1>
            </div>
            <div className="cell small-4 large-4 medium-4">
              <h1>{this.state.homeTeam.teamName ? " vs " : "New Game"}</h1>
            </div>
            <div className="cell small-4 large-4 medium-4">
              <h1>{this.state.awayTeam.teamName}</h1>
            </div>
          </div>
          <h3 className="cell small-12 medium-12 large-12 text-center">
            {this.state.location ? (
              "Happening now in " + this.state.location
            ) : (
              ""
            )}{" "}
            {showEditLink}
          </h3>
        </div>
      );
    };

    const showView = () => {
      switch (this.props.storeState.viewState) {
        case constants.viewStates.SETUP_GAME_VIEW:
          return (
            <div
              id="jsxSetGameLocationAndTeams"
              className="cell small-12 medium-12 large-12"
            >
              <div className="grid-x grid-padding-y cell">
                <div className="auto cell" />
                <div className="cell small-8 medium-6 large-4">
                  <label>
                    {" "}
                    Game Location (eg. Andover, MA):
                    <input
                      onChange={this.handleLocationFieldChange}
                      type="text"
                    />
                  </label>
                </div>
                <div className="auto cell" />
              </div>
              <div className="grid-x grid-padding-y cell small-12 medium-12 large-12 ">
                <div className="cell text-center small-4 medium-4 large-4">
                  <TeamSelector
                    team="homeTeam"
                    teamLabel="Home"
                    handleTeamSelection={this.handleTeamSelection}
                    teams={this.props.storeState.teams}
                  />
                </div>
                <div className="auto cell">
                  <h3 className="text-center subheader vertical-middle">vs</h3>
                </div>
                <div className=" cell text-center small-4 medium-4 large-4">
                  <TeamSelector
                    team="awayTeam"
                    teamLabel="Away"
                    handleTeamSelection={this.handleTeamSelection}
                    teams={this.props.storeState.teams}
                  />
                </div>
              </div>

              {this.props.storeState.teamsSelected ? (
                <div
                  id="jsxPlayerSelect"
                  className="cell grid-x small-12 medium-12 large-12"
                >
                  {this.props.storeState.homeTeam.players ? (
                    <PlayerAddSelectDisplay
                      team={this.state.homeTeam}
                      selectPlayer={this.setPlayerStates}
                    />
                  ) : (
                    "Getting Players for the home team..."
                  )}
                  <div className="auto cell">
                    <h3 className="text-center subheader vertical-middle">
                      vs
                    </h3>
                  </div>
                  {this.props.storeState.awayTeam.players ? (
                    <PlayerAddSelectDisplay
                      team={this.state.awayTeam }
                      selectPlayer={this.setPlayerStates}
                    />
                  ) : (
                    "Getting Players for the away team..."
                  )}
                </div>
              ) : (
                ""
              )}
              {this.state.playersSelected ? (
                <div className="cell small-12 medium-12 large-12 text-center">
                  <button className="button" onClick={this.setupComplete}>
                    GO!
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        case constants.viewStates.RECORD_GAME_VIEW:
          return ( <RecordInningView /> );
        default:
          return "";
      }
    };

    return (
      <div id="GameSetupRecord" className="cell grid-x grid-y auto">
        <GameHeader />
        {this.props.children}
        {showView()}
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    storeState: store.gameState // THIS SUCKS THAT I CAN'T INSPECT THE PROPERTIES OF "STORE" ... SEEMS LIKE A BUG
  };
};

export default connect(mapStateToProps)(GameSetupRecord);
