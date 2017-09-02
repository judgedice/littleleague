import React, { Component } from 'react'
import PitchCountView from './Containers/PitchCountView'
import { update } from 'react-addons-update'
import GameView from "./Containers/GameView"
// import { Provider } from "react-redux"


var stateObject = {
    currentPitcher: "",
    currentBatter: "bob bobson",
    currentInning: 1,
    teams: {},
    players: [''],
    pitchesThisInning: [], // array of all pitch objects just for the inning
};


// function Search() {
//   return (
//     <div className="container">
//       <CurrentRefinements/>
//       <ClearAll/>
//       <SearchBox />
//       <RefinementList attributeName="category" />
//       <Hits hitComponent={Product} />
//       <Pagination />
//     </div>
//   );
// }

// function Product({hit}) {
//   return (
//     <div style={{marginTop: '10px'}}>
//       <span className="hit-name">
//         Highlight attributeName="name" hit={hit} />
//       </span>
//     </div>
//   );
// };

class App extends Component {
    constructor(props) {
        super(props)
        this.state = stateObject
        // this.addNewPitch = this.addNewPitch.bind(this);
        // this.showAllTeams = this.showAllTeams.bind(this);
        // this.allTeamsResults = this.allTeamsResults.bind(this);
        // this.allPlayersResults = this.allPlayersResults.bind(this);
        // this.countBalls = this.countBalls.bind(this);
        // this.countTotal = this.countTotal.bind(this);
        // this.countStrikes = this.countStrikes.bind(this);
        // this.modifyPitch = this.modifyPitch.bind(this)
    }



    // THIS METHOD SHOWS ALL THE TEAMS FROM SEARCH
    allTeamsResults(err, content) {

        if (err) {
            console.log(err)
            return
        }

        // index.search("player avengers", {
        //             "hitsPerPage": "10",
        //             "page": "0",
        //             "attributesToRetrieve": "name, age",
        //             "facets": "[]"
        //             }, this.allPlayersResults )

        // for (var h in content.hits) {
        //     var searchValue = content.hits[h].teamName
        //     index.search(searchValue, {
        //         "restrictSearchableAttributes": "onTeam",
        //         "hitsPerPage": "10",
        //         "page": "0",
        //         "attributesToRetrieve": ["name", "age", "onTeam"],
        //         "facets": "[]"
        //     }, this.allPlayersResults)
        // }
        // this.setState((prevState, props) => ({
        //     teams: content.hits
        // }))
    }

    // THIS METHOD SHOWS ALL PLAYERS FROM SEARCH
    allPlayersResults(err, content) {

        if (err) {
            console.log(err)
            return
        }
        var playersToAdd = content.hits
        var currentState = this.state.players
        // console.log(currentState)
        var newState = currentState.length ? update(this.state, {
            players: { $push: playersToAdd }
        }) : playersToAdd

        this.setState({ players: newState })

        // console.log(newState)
    }


    showAllTeams() {
        // index.search("team", {
        //     "hitsPerPage": "100",
        //     "page": "0",
        //     "restrictSearchableAttributes": "type",
        //     "attributesToRetrieve": ["teamName", "location"],
        //     "facets": "[]"
        // }, this.allTeamsResults)
    }



    render() { // TODO... MOVE THE PITCH COUNTER AND DISPLAYS TO THE PITCHCOUNT VIEW
        return (<div className="grid-container">
            <div className="grid-x grid-padding-x">
                <div className="large-6 medium-8 small-12 cell">
                   <GameView />
                </div>
            </div>

        </div>)
    }


    // render() {
    //   return (
    //   <PitchCountView />
    //      <InstantSearch
    //      appId="latency"
    //       apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
    //       indexName="bestbuy"

    // >    <Search />
    // </InstantSearch>
    //   );
    // }
}


//  appId="M008EL2TS7"
//     apiKey="2f534330dc6a3ee61e2a3b7a0c5b26fe"
//     indexName="little_leage_dev"

export default App;




// <PitchCounter inning={this.state.currentInning}
//                         player={this.state.currentPitcher}
//                         pitchCount={this.state.currentPitchCount}
//                         addPitch={this.addNewPitch}
//                         modifyPitch={this.modifyPitch} />