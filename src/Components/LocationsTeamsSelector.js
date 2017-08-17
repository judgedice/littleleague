import React, { Component } from "react";
// import algoliasearch from "algoliasearch";
import TeamSelector from "./SubComponents/TeamSelector";
import store from "../store";
import * as api from "../api/algoliamethods";
import _ from "lodash";
import { connect } from "react-redux";
import { beginSearch } from "../actions/gameactions";

//
//
// TODO... STYLE THIS SHIT, OTHERWISE I THINK YOU'RE DONE
//
//
//
//
//

class LocationsTeamSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: []
    };
    this.handleTeamSelection = this.handleTeamSelection.bind(this);
    this.handleLocationFieldChange = this.handleLocationFieldChange.bind(this);
  }
  componentDidMount() {
    api.searchTeams();
    store.dispatch(beginSearch("teams", "Searching for Teams with Provider"));
  }

  // EVENT HANDLERS

  handleTeamSelection(e) {
    e.preventDefault();
    var teamObj = _.filter(this.state.teams, { objectID: e.target.value });
    this.props.handleTeamSelect(teamObj[0], e.target.id); // THE TEAMOBJECT IS GOING TO BE A 1 ITEMED ARRAY
  }

  handleLocationFieldChange(e) {
    e.preventDefault();
    this.props.handleLocationFieldChange(e.target.value);
  }

  render() {
    return (
      <div className="cell">
        <div className="grid-x cell">
          <div className="cell small-8">
            <input onChange={this.handleLocationFieldChange} type="text" />
          </div>
        </div>
        <div className="grid-x cell small-12 ">
          <div className="cell small-4">
            <TeamSelector
              team="homeTeam"
              handleTeamSelection={this.handleTeamSelection}
              teams={this.props.teams}
            />
          </div>
          <div className="cell small-4 text-center">
            <h3>vs</h3>
          </div>
          <div className="cell text-right small-4">
            <TeamSelector
              team="awayTeam"
              handleTeamSelection={this.handleTeamSelection}
              teams={this.props.teams}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    teams: store.gameState.teams
  };
};

export default connect(mapStateToProps)(LocationsTeamSelector);
