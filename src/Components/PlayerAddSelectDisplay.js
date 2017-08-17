import React from 'react';
import AddPlayer from './AddPlayer'
import algoliasearch from 'algoliasearch'
import _ from 'lodash'

const PITCHER_DISPLAY_VIEW = "PITCHER_DISPLAY_VIEW"
const PITCHER_SELECT_VIEW = "PITCHER_SELECT_VIEW"
const PITCHER_TEAM_SELECT_VIEW = "PITCHER_TEAM_SELECT_VIEW"
const PLAYER_ADD_VIEW = "PLAYER_ADD_VIEW"


// ALGOLIA SETUP ... NEED TO ELIMINATE THIS API KEY AS IT IS PUBLISHED AND ADMIN
const client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");



// PitcherDisplay Component

class PlayerAddSelectDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddPlayer: false,
            viewState: "",
            teams: [],
            players: [],
            currentTeamID: 0,
            currentTeamName: "",
            currentPlayer: {},
            quickRecord: "false" // IF THIS VIEW IS IN "QUICK RECORD MODE, THEN JUST STORE PLAYERS LOCALLY, NO TEAMS"
        }


        this.handleChangePlayerClick = this.handleChangePlayerClick.bind(this)
        // this.searchTeams = this.searchTeams.bind(this)
        // this.allTeamsResults = this.allTeamsResults.bind(this)
        this.allPlayersResults = this.allPlayersResults.bind(this)
        // this.handleTeamSelection = this.handleTeamSelection.bind(this)
        this.searchPlayersByCurrentTeam = this.searchPlayersByCurrentTeam.bind(this)
        this.handlePlayerSelect = this.handlePlayerSelect.bind(this)
        this.setParentState = this.setParentState.bind(this)
        this.handlePlayerAdded = this.handlePlayerAdded.bind(this)
    }

    componentDidMount() {
        this.searchPlayersByCurrentTeam( this.props.teamID )
        console.log( ` Searching for players by team id:
        
        
        ${this.props.teamID}
        
        
        
        Great, right!?`)
    }

    searchPlayersByCurrentTeam( teamID ) {
        var index = client.initIndex('little_league_players');
        // index.setSettings({
        //     attributesForFaceting: [
        //         'playerTeamID'
        //     ]
        // });
        // console.log("searching by id: " + this.state.currentTeamID)
        var filterString = `('playerTeamID':${teamID} )`
        index.search("", {
            "hitsPerPage": "100",
            "filters": filterString,
            "attributesToRetrieve": ["playerFirstName", "playerLastName", "isPitcher", "playerAge", "objectID"]
            //"facets": "[]"
        }, this.allPlayersResults)

    }

    setParentState() {
        this.props.selectPlayer(this.state.currentPlayer)
        this.setState({ viewState: PITCHER_DISPLAY_VIEW })
    }

    allPlayersResults(err, content) {
        if (err) {
            alert("error " + err)
            return
        }
        var players = content.hits;
        console.log( "Players: " +  players );
        this.setState({ players: players })
        this.setState({ viewState: PITCHER_SELECT_VIEW })
    }

    handlePlayerAdded(props, content) {

        console.log("in handleplayer added: " + content)
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


    handleChangePlayerClick(e) { // CLICKING THE 'CHANGE' BUTTON TRIGGERS THIS
        e.preventDefault()
        this.setState({ viewState: PITCHER_TEAM_SELECT_VIEW })

    }

    // handleTeamSelection(e) { // MAKING A SELECTION FROM THE TEAM DROPDOWN
    //     // this.props.selectPitcher( e.target )
    //     e.preventDefault()
    //     var teamObj = _.filter(this.state.teams, { objectID: e.target.value })
    //     // console.log(" team id: " + e.target.value)
    //     this.setState({ currentTeamID: e.target.value, currentTeamName: teamObj[0].teamName }, this.searchPlayersByCurrentTeam)

    // }

    handlePlayerSelect(e) { // MAKING A SELECTION FROM THE PLAYER DROPDOWN
        e.preventDefault()
        if (e.target.value === "addNewPlayer") {
            this.setState({ viewState: PLAYER_ADD_VIEW })
            return
        }
        var playerObj = _.filter(this.state.players, { objectID: e.target.value })
        this.setState({ currentPlayer: playerObj[0] }, this.setParentState)
    }

    render() {
        // console.log( "state: " + this.state.viewState + " and prev state " + this.state.prevState )
        // THIS METHOD IS BEING CALLED WAY TOO MUCH I THINK... CHECK IT OUT
        if (this.state.viewState === PITCHER_DISPLAY_VIEW) { // SIMPLY DISPLAY THE PITCHER AND TEAM NAME
            return (
                <div>
                    <h3>{this.state.currentPlayer.playerFirstName + " " + this.state.currentPlayer.playerLastName} <button className="button tiny success" onClick={this.handleChangePlayerClick} >Change</button> </h3>
                    <span>{this.state.currentTeamName}</span>
                </div>

            )
        }
        else if (this.state.viewState === PITCHER_TEAM_SELECT_VIEW) { // NEED TO SELECT THE PITCHER
           
            if (this.state.currentTeamName !== "") {
                this.searchPlayersByCurrentTeam( this.state.currentTeamID )
                return (<div> GETTING PITCHERS...</div>)
            } else {
                return (<div>
                    <label>Select Team:
                            <select onChange={this.handleTeamSelection}>
                            <option disabled selected value> -- Teams... -- </option>
                            {this.state.teams.map((team, i) =>
                                <option key={i} label={team.teamName} value={team.objectID}>{team.teamName}</option>
                            )}

                        </select>
                    </label>
                </div>
                )
            }
        } else if (this.state.viewState === PITCHER_SELECT_VIEW) {
            return (<div>
                <label>Select Player from {this.state.currentTeamName}
                    <select onChange={this.handlePlayerSelect}>
                        <option disabled selected value> -- Pitchers... -- </option>
                        {this.state.players.map((player, i) =>
                            <option key={i} value={player.objectID}>{player.playerFirstName + " " + player.playerLastName}</option>
                        )}
                        <option label="Add New Player" value="addNewPlayer">Add New Player</option>

                    </select>
                </label>
            </div>
            )
        }
        else if (this.state.viewState === PLAYER_ADD_VIEW) {
            return (
                <div className="addPlayerModal">
                    <AddPlayer teams={this.state.teams} playerAdded={this.handlePlayerAdded} teamName={this.state.currentTeamName1} teamID={null} />
                </div>
            )
        
        } else return <div>GETTING PLAYER ROSTERS BY TEAM!</div>



    }


}


export default PlayerAddSelectDisplay