import React, { Component } from "react";
// import PropTypes from "prop-types";
import { GameScore } from "../Components/SubComponents/GameScore";
import Collapsible from "react-collapsible";
import RecordInningView from "../Containers/RecordInningView";
import LocationsTeamsSelector from "../Components/LocationsTeamsSelector";
import PlayerAddSelectDisplay from "../Components/PlayerAddSelectDisplay";
import store from "../store";
// import { selectTeamsSuccess } from "../actions/gameactions";
import * as api from "../api/algoliamethods";
import * as constants from "../constants";
import { connect } from "react-redux";
import { selectPlayersSuccess } from "../actions/gameactions";

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
      currentPitcherName: "",
      currentAtBatName: "",
      currentInning: 1,
      currentOutCount: 0,
      location: "",
      viewState: constants.viewStates.SELECT_LOCATION_TEAMS_VIEW,
      teamsSelected: false,
      temporaryGameObject: {}
    };

    this.setTeamSelection = this.setTeamSelection.bind(this);
    this.setGameLocation = this.setGameLocation.bind(this);
    this.handleTeamStateSetting = this.handleTeamStateSetting.bind(this);
    this.handleTeamsLocationSetButtonClick = this.handleTeamsLocationSetButtonClick.bind(
      this
    );
    this.setPlayerStates = this.setPlayerStates.bind(this);
    this.handlePlayersSet = this.handlePlayersSet.bind(this);
    // this.toggleView = this.toggleView.bind(this)
  }

  // UTILITY METHODS

  // EVENT HANDLERS
  setPlayerStates(prop) {
    console.log(" GameView, setting player states: " + prop.isPitcher);
    if (prop.isPitcher) {
      this.setState(
        {
          currentPitcherName: prop.playerFirstName + " " + prop.playerLastName
        },
        this.handlePlayersSet
      );
    } else
      this.setState(
        { currentAtBatName: prop.playerFirstName + " " + prop.playerLastName },
        this.handlePlayersSet
      );
  }

  handlePlayersSet() {
    if (
      this.state.currentAtBatName !== "" &&
      this.state.currentPitcherName !== ""
    ) {
      console.log(
        " game view handle Players set, pitchername: " +
          this.state.currentPitcherName
      );
      store.dispatch(
        selectPlayersSuccess(
          this.state.currentPitcherName,
          this.state.currentAtBatName,
          "Players Selected, PLAY BALL!"
        )
      );
      // store.setState( {currentPitcherName: this.state.currentPitcherName, currentAtBatName:this.state.currentAtBatName})
      // console.log("players are set ");
      this.setState({ viewState: constants.viewStates.RECORD_GAME_VIEW });
    }
  }

  handleTeamsLocationSetButtonClick(e) {
    // THIS IS CALLED AFTER THE BUTTON IS VISIBLE, WHICH IS AFTER ALL THE APPROPRIATE STATE VALUES ARE SET
    e.preventDefault();
    api.addNewGameData(this.state.temporaryGameObject); // TODO: I DON'T CARE IF THIS WORKED OR NOT. I HAVE LOCAL STATE. BUT I WANT TO INFORM THE USER IF IT DIDN'T WORK
    // this.setState({ viewState: SELECT_PLAYERS });
  }

  setTeamSelection(teamObject = {}, whichTeam = "homeTeam") {
    this.setState({ [whichTeam]: teamObject }, this.handleTeamStateSetting);
    // console.log( "setting team " + whichTeam + " val: " + teamObject )
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

      this.setState({ temporaryGameObject: gameObject, teamsSelected: true });
    }
  }

  componentDidMount() {}

  render() {
    function showEditLink() {
      if (this.props.storeState.currentInning === 1) return "";
      else return <a href="#record">Record Next Inning</a>;
    }

    // let collapseTrigger = <div>View Game Stats for {this.state.homeTeam.name}</span></div>
    const GameHeader = props => {
      return (
        <div className="cell grid-x">
          <div className="cell grid-x text-center small-12 large-12 medium-12">
            <div className="cell small-4 large-4 medium-4">
              <h1 className="">{this.state.homeTeam.teamName}</h1>
            </div>
            <div className="cell small-4 large-4 medium-4">
            <h1>{ this.state.homeTeam.teamName ? " vs " : "New Game"}</h1>
            </div>
            <div className="cell small-4 large-4 medium-4">
              <h1>{this.state.awayTeam.teamName}</h1>
            </div>
          </div>
          <span className="cell small-12 medium-12 large-12 text-center">
            {this.state.location ? (
              "Happening now in " + this.state.location
            ) : (
              ""
            )}{" "}
            {showEditLink}
          </span>
        </div>
      );
    };
    function collapseTrigger(prop = "No Teams Selected") {
      return <span>View Game Stats for {prop}</span>;
    }

    // if ( this.state.currentInning === 0 && ( !this.state.homeTeam && !this.state.awayTeam ) ) showEditLink = "";

    switch (this.props.storeState.viewState) {
      case constants.viewStates.SELECT_LOCATION_TEAMS_VIEW:
        return (
          <div className="grid-container">
            <GameHeader />
            <LocationsTeamsSelector
              handleTeamSelect={this.setTeamSelection}
              handleLocationFieldChange={this.setGameLocation}
            />
            {this.state.teamsSelected ? (
              <button
                className="button"
                onClick={this.handleTeamsLocationSetButtonClick}
              >
                Go
              </button>
            ) : (
              ""
            )}
          </div>
        );
      case constants.viewStates.SELECT_PLAYERS_VIEW:
        return (
          <div className="cell grid-x">
            <GameHeader />
            <div className="cell small-4 medium-4 large-4">
              
              <PlayerAddSelectDisplay
                teamID={this.state.homeTeam.objectID}
                selectPlayer={this.setPlayerStates}
              />
            </div>
            <div className="cell  small-4 medium-4 large-4" />
            <div className="cell  small-4 medium-4 large-4">
              <PlayerAddSelectDisplay
                teamID={this.state.awayTeam.objectID}
                selectPlayer={this.setPlayerStates}
              />
            </div>
          </div>
        );
      case constants.viewStates.SELECT_GAME_VIEW:
        break;

      case constants.viewStates.QUICK_RECORD_VIEW:
        break;
      case constants.viewStates.RECORD_GAME_VIEW:
        return (
          <div>
            <GameHeader />
            <RecordInningView />;
          </div>
        );
      case constants.viewStates.DEFAULT_GAME_VIEW:
        return (
          <div className="cell">
            <div className="cell callout small-10 align-center text-center">
              <span className="cell">
                Now Pitching: {this.state.currentPitcherName}
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
}

const mapStateToProps = function(store) {
  return {
    storeState: store.gameState
  };
};

export default connect(mapStateToProps)(GameView);

// {
//   <div className="grid-x">
//     <div className="cell text-center">
//       <h1 className="">
//         {this.state.homeTeam.teamName
//           ? this.state.homeTeam.teamName + "  vs  "
//           : "New Game"}{" "}
//         {this.state.awayTeam.teamName}
//       </h1>
//     </div>
//     <span className="cell text-center">
//       {this.state.location
//         ? "Happening now in " + this.state.location
//         : ""}{" "}
//       {showEditLink}
//     </span>
//     {toggleView(this)}
//   </div>;
// }

// function toggleView(this) {
//   // INITALLY WE WON'T BE RECORDING PITCHES
//   switch (this.state.viewState) {
//     case SELECT_LOCATION_TEAMS:
//       return (
//         <div>
//           <LocationsTeamsSelector
//             handleTeamSelect={this.setTeamSelection}
//             handleLocationFieldChange={this.setGameLocation}
//           />
//           {this.state.teamsSelected
//             ? <button
//                 className="button"
//                 onClick={this.handleTeamsLocationChosen}
//               >
//                 Go
//               </button>
//             : ""}
//         </div>
//       );
//     case SELECT_PLAYERS:
//       return (
//         <div className="cell grid-x">
//           <div className="cell grid-x small-4">
//             <PlayerAddSelectDisplay
//               teamID={this.state.homeTeam.objectID}
//               selectPlayer={this.setPlayerStates}
//             />
//           </div>
//           <div className="cell grid-x small-4" />
//           <div className="cell grid-x small-4">
//             <PlayerAddSelectDisplay
//               teamID={this.state.awayTeam.objectID}
//               selectPlayer={this.setPlayerStates}
//             />
//           </div>
//         </div>
//       );
//     case SELECT_GAME:
//       break;

//     case QUICK_RECORD:
//       break;
//     case RECORD_GAME:
//       return <PitchCountView />;
//     case VIEW_GAME:
//       return (
//         <div className="cell">
//           <div className="cell callout small-10 align-center text-center">
//             <span className="cell">
//               Now Pitching: {this.state.currentPitcherName}
//             </span>
//           </div>
//           <GameScore
//             team1={this.state.homeTeam.name}
//             score1={this.state.homeTeam.currentScore}
//             team2={this.state.awayTeam.name}
//             score2={this.state.awayTeam.currentScore}
//           />
//           <div className="grid-x large-10 small-10 align-center cell callout primary text-center">
//             <span className="cell small-5">
//               INNING : {this.state.currentInning}
//             </span>
//             <span className="cell small-2" />
//             <span className="cell small-5">
//               OUTS: {this.state.currentOutCount}
//             </span>
//           </div>
//           <div className="cell small-10 align-center">
//             <Collapsible
//               trigger={collapseTrigger(this.state.homeTeam)}
//               transitionTime={100}
//             >
//               <p>
//                 This is the collapsible content. It can be any element or
//                 React component you like.
//               </p>
//               <p>
//                 It can even be another Collapsible component. Check out the
//                 next section!
//               </p>
//             </Collapsible>
//           </div>
//         </div>
//       );
//     default:
//       return <div> nothing </div>;
//   }
