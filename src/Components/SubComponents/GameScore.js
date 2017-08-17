import React from 'react'

// THIS COMPONENT SHOWS A SMALL GRAY BAR WITH THE SCORES FOR TWO TEAMS
//TODO... CHANGE COLORS IN FOUNDATION


export const GameScore = ({ team1, score1, team2, score2 }) => (
    <div className="grid-x grid-padding-x primary callout small small-10 align-center">
        <div className="large-4 medium-4 small-4 cell text-center">
            <h3 className="no-padding"> {team1} : {score1} </h3>
        </div>
        <div className="large-4 medium-4 small-4 cell text-center">
            <h3 className="no-padding">VS</h3>
        </div>
        <div className="large-4 medium-4 small-4 cell text-center">
            <h3 className="no-padding"> {team2} : {score2} </h3>
        </div>
    </div>



)