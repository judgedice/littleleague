import React from "react";
import AddPlayer from "./AddPlayer";
// import algoliasearch from 'algoliasearch'
import _ from "lodash";
import store from "../store";
import * as api from "../api/algoliamethods";
import { connect } from "react-redux";

const PLAYER_DISPLAY_VIEW = "PITCHER_DISPLAY_VIEW";
const PLAYER_SELECT_VIEW = "PITCHER_SELECT_VIEW";
// const PITCHER_TEAM_SELECT_VIEW = "PITCHER_TEAM_SELECT_VIEW"
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
      teams: [],
      players: [],
      currentTeamID: 0,
      currentTeamName: "",
      currentPlayer: {},
      quickRecord: "false" // IF THIS VIEW IS IN "QUICK RECORD MODE, THEN JUST STORE PLAYERS LOCALLY, NO TEAMS"
    };

    this.handleChangePlayerClick = this.handleChangePlayerClick.bind(this);
    // this.searchTeams = this.searchTeams.bind(this)
    // this.allTeamsResults = this.allTeamsResults.bind(this)
    // this.allPlayersResults = this.allPlayersResults.bind(this)
    // this.handleTeamSelection = this.handleTeamSelection.bind(this)
    // this.searchPlayersByCurrentTeam = this.searchPlayersByCurrentTeam.bind(this)
    this.handlePlayerSelect = this.handlePlayerSelect.bind(this);
    this.setParentState = this.setParentState.bind(this);
    this.handlePlayerAdded = this.handlePlayerAdded.bind(this);
    this.storeListener = this.storeListener.bind(this);
  }

  componentWillMount() {
    api.getPlayersByTeam(this.props.team.objectID);
    store.subscribe(this.storeListener);
  }

  storeListener() {
    if (this.props.team.players !== []) {
      this.setState({ players: this.props.team.players });
    }
  }

  // REMOVE THIS AND CALL THE ALGOLIA METHODS SO THE TEAM PLAYERS CAN LIVE IN STATES
  // sealayersByCurrentTeam( teamID ) {
  //     var index = client.initIndex('little_league_players');
  //     var filterString = `('playerTeamID':${teamID} )`
  //     index.search("", {
  //         "hitsPerPage": "100",
  //         "filters": filterString,
  //         "attributesToRetrieve": ["playerFirstName", "playerLastName", "isPitcher", "playerAge", "objectID"]
  //         //"facets": "[]"
  //     }, this.allPlayersResults)

  // }

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
    //this.setState({ viewState: PITCHER_TEAM_SELECT_VIEW })
  }

  handlePlayerSelect(e) {
    // MAKING A SELECTION FROM THE PLAYER DROPDOWN
    e.preventDefault();
    if (e.target.value === "addNewPlayer") {
      // this.setState({ viewState: PLAYER_ADD_VIEW }) THIS IS ON PAUSE FOR NOW
      return;
    }
    var playerObj = _.filter(this.state.players, { objectID: e.target.value });

    // SETTING CURRENT PLAYER IN THIS COMPONENT SO IT DISPLAYS IT WHEN SELECTED
    this.setState({ currentPlayer: playerObj[0] }, this.setParentState);
  }

  render() {
    if (this.state.viewState === PLAYER_DISPLAY_VIEW) {
      // SIMPLY DISPLAY THE PITCHER AND TEAM NAME
      return (
        <div>
          <h3>
            {this.state.currentPlayer.playerFirstName +
              " " +
              this.state.currentPlayer.playerLastName}{" "}
            <button
              className="button tiny success"
              onClick={this.handleChangePlayerClick}
            >
              Change
            </button>{" "}
          </h3>
          <span>{this.state.currentTeamName}</span>
        </div>
      );
    } else if (this.props.team) {
      // CHOOSE FROM LIST OF PLAYERS
      return (
        <div>
          <label>
            Select Player
            <select defaultValue="default" onChange={this.handlePlayerSelect}>
              <option disabled value="default">
                {" "}
                -- Players... --{" "}
              </option>
              {this.state.players.map((player, i) => (
                <option key={i} value={player.objectID}>
                  {player.playerFirstName + " " + player.playerLastName}{" "}
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
    } else if (this.state.viewState === PLAYER_ADD_VIEW) {
      return (
        <div className="addPlayerModal">
          <AddPlayer
            teams={this.state.teams}
            playerAdded={this.handlePlayerAdded}
            teamName={this.state.currentTeamName1}
            teamID={null}
          />
        </div>
      );
    } else return <div>GETTING PLAYER ROSTERS BY TEAM!</div>;
  }
}

const mapStateToProps = function(store) {
  return {
    storeState: store.gameState
  };
};

export default connect(mapStateToProps)(PlayerAddSelectDisplay);

// export default PlayerAddSelectDisplay

// THIS IS FROM WHEN THIS COMPONENT HANDLED THE TEAM LOOKUP TOO, DOESN'T ANYMORE

// else if (this.state.viewState === PITCHER_TEAM_SELECT_VIEW) { // NEED TO SELECT THE PITCHER

//      if (this.state.currentTeamName !== "") {
//          this.searchPlayersByCurrentTeam( this.state.currentTeamID )
//          return (<div> GETTING PITCHERS...</div>)
//      } else {
//          return (<div>
//              <label>Select Team:
//                      <select defaultValue='default' onChange={this.handleTeamSelection}>
//                      <option disabled value='default'> -- Teams... -- </option>
//                      {this.state.teams.map((team, i) =>
//                          <option key={i} label={team.teamName} value={team.objectID}>{team.teamName}</option>
//                      )}

//                  </select>
//              </label>
//          </div>
//          )
//      }
