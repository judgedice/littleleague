import React, { Component } from 'react';
import algoliasearch from 'algoliasearch'


// AddPlayer is an input form for adding a new player. A Player must be added to a team,
// and can be marked as a pitcher or not (boolean). This allows the player
// to be a batter and/or a pitcher in the system.

var client = algoliasearch("M008EL2TS7", "2f534330dc6a3ee61e2a3b7a0c5b26fe");
var index = client.initIndex('little_league_players');

// Initial State
const stateObj = {
    playerFirstName: "",
    playerLastName: "",
    playerTeamID: 0, // TEAM ID
    playerTeamName: "",
    playerAge: 0,
    isPitcher: false

}


class AddPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = stateObj
        this.handleForm = this.handleFormSubmit.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)

        if (this.props.teamID != null) {
            stateObj.playerTeamID = this.props.teamID
            stateObj.playerTeamName = this.props.teamName
            stateObj.showTeam = true;
            // stateObj.showTeam = true
        }
        else stateObj.showTeam = false
        // else stateObj.showTeam = false

        this.state = stateObj
    }



    handleFocus(e) { // MOVE THE LABEL ABOVE THE INPUT VALUE AND TURN IT BLUE   
        e.target.parentNode.className = "form-floating-label has-value"
    }

    handleBlur(e) { // IF INPUT IS EMPTY, PUT THE LABEL BACK
        if (e.target.value.length < 1) {
            e.target.parentNode.className = "form-floating-label"
        }

    }

    handleInputChange(e) { // THIS SETS THE 'STATE' OF THE COMPONENT AS THE INPUT VALUES CHANGE
        // WE'LL USE THE STATE OBJECT FOR SUBMISSION TO ALGOLIA
        const stateProp = e.target.name
        var stateValue = e.target.value

        if (stateProp === "isPitcher") {
            stateValue = e.target.checked
        }
        // console.log("prop: " + stateProp + " : " + stateValue)
        this.setState({ [stateProp]: stateValue });
    }

    handleFormSubmit(e) {
        e.preventDefault()
        if( e.target.value === "cancel" )
            {
                // GET RID OF THIS
            }
        index.addObject(this.state, function (err, content) {

            console.log(content);
            if (err) {
                alert('error! ' + err)
            }
            this.props.playerAdded(this.state, content);
        }.bind(this));


        // console.log(this.state)
    }

    render() {
        console.log( this.props.teams )
        var showTeam = {
            hasTeam:
            <div className="form-floating-label has-value">
                <input type="text" onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} id="playerTeam" name="playerTeam" value={this.state.playerTeamName} />
                <label htmlFor="playerTeam">Team</label>
            </div>,
            noTeamSelected:
            <div className="form-floating-label">
                <select>
                {this.props.teams.map((team, i) =>
                            <option key={i} value={team.objectID}>{team.teamName}</option>
                        )}
                </select>
                <label htmlFor="playerTeam">Team</label>
            </div>
        }

        return (
            <form onSubmit={this.handleForm}>
                <div className="row">
                    <h4>Add a New Player</h4>
                    <div className="small-12 column">
                        <div className="form-floating-label">
                            <input type="text" onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} id="playerFirstName" name="playerFirstName" required />
                            <label htmlFor="playerFirstName">First Name</label>
                        </div>
                    </div>
                    <div className="small-12 column">
                        <div className="form-floating-label">
                            <input type="text" onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} id="playerLastName" name="playerLastName" required />
                            <label htmlFor="playerLastName">Last Name</label>
                        </div>
                    </div>


                    <div className="small-12 column">
                        <div className="form-floating-label">
                            <input type="number" onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} id="playerAge" name="playerAge" />
                            <label htmlFor="playerAge">Age</label>
                        </div>
                    </div>
                    <div className="small-12 column">
                        { this.state.showTeam ? showTeam.hasTeam : showTeam.noTeamSelected}
                    </div>
                    <div className="small-12 column">
                        <div>
                                    <input type="checkBox" onChange={this.handleInputChange} id="isPitcher" name="isPitcher" />
                                    <label htmlFor="isPitcher">Pitcher</label>
                        </div>
                    </div>
                            <div className="small-12 column">
                                <button className="button small success" type="submit" value="submit" >Submit</button>
                                
                            </div>
                        </div>
            </form>

                    )

    }


}

export default AddPlayer