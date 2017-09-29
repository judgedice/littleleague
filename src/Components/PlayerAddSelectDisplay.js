import React from "react";
import AddPlayer from "./AddPlayer";
// import algoliasearch from 'algoliasearch'
import _ from "lodash";
import store from "../store";
import * as api from "../api/algoliamethods";
import { connect } from "react-redux";

const PLAYER_DISPLAY_VIEW = "PITCHER_DISPLAY_VIEW";
const PLAYER_SELECT_VIEW = "PITCHER_SELECT_VIEW";
const PLAYER_ADD_VIEW = "PLAYER_ADD_VIEW";

// ALGOLIA SETUP ... NEED TO ELIMINATE THIS API KEY AS IT IS PUBLISHED AND ADMIN
// const client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");

// PitcherDisplay Component

class PlayerAddSelectDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddPlayer: false,
      viewState: PLAYER_SELECT_VIEW,
      currentTeam: {},
      currentPlayer: {},
      quickRecord: "false" // IF THIS VIEW IS IN "QUICK RECORD MODE, THEN JUST STORE PLAYERS LOCALLY, NO TEAMS"
    };

    this.handleChangePlayerClick = this.handleChangePlayerClick.bind(this);
    this.handlePlayerSelect = this.handlePlayerSelect.bind(this);
    this.setParentState = this.setParentState.bind(this);
    this.handlePlayerAdded = this.handlePlayerAdded.bind(this);
    this.storeListener = this.storeListener.bind(this);
  }

  componentDidMount() {
    // WHEN COMPONENT RENDERS, GET THE PLAYERS BY TEAM FROM ALGOLIA:
    // TODO: MAKE THIS OFFLINE FIRST. IF PLAYERS ARE IN STORE ALREADY
    // THEN USE THAT LIST INSTEAD OF CALLING SERVICE
    // api.getPlayersByTeam(this.props.team.objectID);
    // SUBSCRIBE TO THE REDUX STORE
    // store.subscribe(this.storeListener);
    if(this.props.player)
      this.setState( { viewState:PLAYER_DISPLAY_VIEW} )
  }

  storeListener() {
    // ONCE THE PLAYERS PROPERTY OF THE TEAM OBJECT IS SET, ADD IT TO THE STATE OF THIS COMPONENT
    // if (this.props.team.players !== undefined ) {
    //   this.setState({ players: this.props.team.players });
    // }
  }

  setParentState() {
    this.props.selectPlayer(this.state.currentPlayer); // PARENT: GAMEVIEW
    
    this.setState({ viewState: PLAYER_DISPLAY_VIEW });
  }

  handlePlayerAdded(props, content) {
    console.log("in handleplayer added: " + content);
    //        this.setState( { playerFirstName: props.playerFirstName, playerLastName: props.playerLastName })
    //         {  OBJECT COMING FROM PROPS
    //     playerFirstName: "",
    //     playerLastName: "",
    //     playerTeamID: 0, // TEAM ID
    //     playerTeamName: "",
    //     playerAge: 0,
    //     isPitcher: false

    // }
  }

  handleChangePlayerClick(e) {
    // CLICKING THE 'CHANGE' BUTTON TRIGGERS THIS
    e.preventDefault();
    this.setState({ viewState: PLAYER_SELECT_VIEW })
  }

  handlePlayerSelect(e) {
    // MAKING A SELECTION FROM THE PLAYER DROPDOWN
    e.preventDefault();
    if (e.target.value === "addNewPlayer") {
      // this.setState({ viewState: PLAYER_ADD_VIEW }) THIS IS ON PAUSE FOR NOW
      return;
    }
    var playerObj = _.filter(this.props.team.players, {
      objectID: e.target.value
    });

    // SETTING CURRENT PLAYER IN THIS COMPONENT SO IT DISPLAYS IT WHEN SELECTED
    this.setState({ currentPlayer: playerObj[0] }, this.setParentState);
  }

  render() {
    
    if ( this.state.viewState === PLAYER_SELECT_VIEW) {
      // CHOOSE FROM LIST OF PLAYERS
      if( this.props.team ){
      return (
        <div className="cell small-4 medium-4 large-4">
          <label>
            Select Player for {this.props.team.teamName}
            <select defaultValue="default" onChange={this.handlePlayerSelect}>
              <option disabled value="default">
                
                -- Players... --
              </option>
              {this.props.team.players.map((player, i) => (
                <option key={i} value={player.objectID}>
                  {player.playerFirstName + " " + player.playerLastName}
                  {player.isPitcher ? "(P)" : ""}
                </option>
              ))}
              <option label="Add New Player" value="addNewPlayer">
                Add New Player
              </option>
            </select>
          </label>
        </div>
      );
    }
    } else if ( this.state.viewState === PLAYER_DISPLAY_VIEW && this.props.player ) {
      // SIMPLY DISPLAY THE PITCHER AND TEAM NAME
      return (
        <span className="player" >
          <span className="playerType">{this.props.playerType}: </span>
          <a href="javascript.void(0);" onClick={this.handleChangePlayerClick}>
          {this.props.player.playerFirstName +
            " " +
            this.props.player.playerLastName}
            </a>
          <span className="playerTeamName"> ({this.props.team.teamName}) </span>
        </span>
      );
    }
      else if (this.state.viewState === PLAYER_ADD_VIEW) {
      return "";
    } else return <div>GETTING PLAYER ROSTERS BY TEAM!</div>;
  }
}

export default PlayerAddSelectDisplay;

// const mapStateToProps = function(store) {
//   return {
//     storeState: store.gameState
//   };
// };

// export default connect(mapStateToProps)(PlayerAddSelectDisplay);

/// ADD PLAYER VIEW CODE, REMOVED FOR NOW:
// <div className="addPlayerModal">
//   <AddPlayer
//     teams={this.state.teams}
//     playerAdded={this.handlePlayerAdded}
//     teamName={this.state.currentTeamName1}
//     teamID={null}
//   />
// </div>
