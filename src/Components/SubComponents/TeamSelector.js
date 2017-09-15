import React from "react";

const TeamSelector = props => {
  return (
    <div id="TeamSelector" className="cell">
      <label>
        Select {props.teamLabel} Team:
        <select id={props.team} defaultValue='default' onChange={props.handleTeamSelection}>
          <option disabled value='default'>
            {" "}-- Teams... --{" "}
          </option>
          {props.teams.map((team, i) =>
            <option key={i} label={team.teamName} value={team.objectID}>
              {team.teamName}
            </option>
          )}
        </select>
      </label>
    </div>
  );
};

export default TeamSelector;
