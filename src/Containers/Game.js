import React, { Component } from "react";
// import PropTypes from "prop-types";
import { GameScore } from "../Components/SubComponents/GameScore";
import Collapsible from "react-collapsible";
import PitchCountView from "../Containers/PitchCountView";
import LocationsTeamsSelector from "../Components/LocationsTeamsSelector";
import PlayerAddSelectDisplay from "../Components/PlayerAddSelectDisplay";
import algoliasearch from "algoliasearch";
import store from "../store";
// import { selectTeamsSuccess } from "../actions/gameactions";
import * as api from "../api/algoliamethods";


class GameView extends Component {
  constructor(props) {
    super(props);

    // // INITIAL STATE
    // this.state = {
    //   homeTeam: {
    //     teamName: "",
    //     objectID: 0,
    //     currentScore: 0
    //   },
    //   awayTeam: {
    //     teamName: "",
    //     objectID: 0,
    //     currentScore: 0
    //   },
    //   currentPitcherName: "",
    //   currentAtBatName: "",
    //   currentInning: 1,
    //   currentOutCount: 0,
    //   location: "",
    //   viewState: SELECT_LOCATION_TEAMS,
    //   teamsSelected: false
    // };

    this.setTeamSelection = this.setTeamSelection.bind(this);
    this.setGameLocation = this.setGameLocation.bind(this);
    this.handleTeamStateSetting = this.handleTeamStateSetting.bind(this);
    this.handleTeamsLocationChosen = this.handleTeamsLocationChosen.bind(this);
    this.setPlayerStates = this.setPlayerStates.bind(this);
    this.handlePlayersSet = this.handlePlayersSet.bind(this);
    // this.toggleView = this.toggleView.bind(this)
  }

  // UTILITY METHODS

  // EVENT HANDLERS
  setPlayerStates(prop) {
    if (prop.isPitcher) {
      this.setState(
        { currentPitcherName: prop.playerName },
        this.handlePlayersSet
      );
    } else
      this.setState(
        { currentAtBatName: prop.playerName },
        this.handlePlayersSet
      );
  }

  handlePlayersSet() {
    if (
      this.state.currentAtBatName !== "" &&
      this.state.currentPitcherName !== ""
    )
      this.setState({ viewState: RECORD_GAME });
  }

  handleTeamsLocationChosen(e) {
    // THIS IS CALLED AFTER THE BUTTON IS VISIBLE, WHICH IS AFTER ALL THE APPROPRIATE STATE VALUES ARE SET
    e.preventDefault();
    // console.log(" all set: " + this.state.awayTeam.objectID);
    this.setState({ viewState: SELECT_PLAYERS });
  }

  setTeamSelection(teamObject = {}, whichTeam = "homeTeam") {
    this.setState({ [whichTeam]: teamObject }, this.handleTeamStateSetting);
  }

  setGameLocation(prop) {
    this.setState({ location: prop }, this.handleTeamStateSetting);
  }

  handleTeamStateSetting() {
    if (
      this.state.homeTeam.objectID !== 0 &&
      this.state.awayTeam.objectID !== 0 &&
      this.state.location !== ""
    ) {
      var gameObject = {
        homeTeam: this.state.homeTeam.objectID,
        awayTeam: this.state.awayTeam.objectID,
        location: this.state.location,
        date: new Date().toDateString()
      };

      this.setState({ teamsSelected: true });

      api.addNewGameData(gameObject);
    }
  }

  componentDidMount() {}

  render() {
    // let collapseTrigger = <div>View Game Stats for {this.state.homeTeam.name}</span></div>

    function collapseTrigger(prop = "No Teams Selected") {
      return (
        <span>
          View Game Stats for {prop}
        </span>
      );
    }

    function toggleView(thisClass) {
      // INITALLY WE WON'T BE RECORDING PITCHES
      switch (thisClass.state.viewState) {
        case SELECT_LOCATION_TEAMS:
          return (
            <div>
              <LocationsTeamsSelector
                handleTeamSelect={thisClass.setTeamSelection}
                handleLocationFieldChange={thisClass.setGameLocation}
              />
              {thisClass.state.teamsSelected
                ? <button
                    className="button"
                    onClick={thisClass.handleTeamsLocationChosen}
                  >
                    Go
                  </button>
                : ""}
            </div>
          );
        case SELECT_PLAYERS:
          return (
            <div className="cell grid-x">
              <div className="cell grid-x small-4">
                <PlayerAddSelectDisplay
                  teamID={thisClass.state.homeTeam.objectID}
                  selectPlayer={thisClass.setPlayerStates}
                />
              </div>
              <div className="cell grid-x small-4" />
              <div className="cell grid-x small-4">
                <PlayerAddSelectDisplay
                  teamID={thisClass.state.awayTeam.objectID}
                  selectPlayer={thisClass.setPlayerStates}
                />
              </div>
            </div>
          );
        case SELECT_GAME:
          break;

        case QUICK_RECORD:
          break;
        case RECORD_GAME:
          return <PitchCountView />;
        case VIEW_GAME:
          return (
            <div className="cell">
              <div className="cell callout small-10 align-center text-center">
                <span className="cell">
                  Now Pitching: {thisClass.state.currentPitcherName}
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
                  trigger={collapseTrigger(thisClass.state.homeTeam)}
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

    let showEditLink = <a href="#record">Record Next Inning</a>;
    if (this.state.currentInning === 1) showEditLink = "";
    // if ( this.state.currentInning === 0 && ( !this.state.homeTeam && !this.state.awayTeam ) ) showEditLink = "";

    return (
      <div className="grid-x">
        <div className="cell text-center">
          <h1 className="">
            {this.state.homeTeam.teamName
              ? this.state.homeTeam.teamName + "  vs  "
              : "New Game"}{" "}
            {this.state.awayTeam.teamName}
          </h1>
        </div>
        <span className="cell text-center">
          {this.state.location
            ? "Happening now in " + this.state.location
            : ""}{" "}
          {showEditLink}
        </span>
        {toggleView(this)}
      </div>
    );
  }
}

export default GameView;
