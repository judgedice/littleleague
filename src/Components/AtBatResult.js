import React, { Component } from "react";

class AtBatResult extends Component {
  render() {
    return (
      <div className="grid-x">
        <div className="grid-x cell small-4 medium-4 large-6">
          <button id="hit-batter" className="button cell" onClick={this.props.endInning} >
            Hit Batter
          </button>
        </div>
        <div className="grid-x cell small-4 medium-4 large-6">
          <button id="walk" className="button cell" onClick={this.props.endInning} >
            Walk
          </button>
        </div>
        <div className="grid-x cell small-4 medium-4 large-6">
          <button id="strikeout" className="button cell" onClick={this.props.endInning} >
            strikeout
          </button>
        </div>
        <div className="grid-x cell small-4 medium-4 large-6">
          <button id="field-out" className="button cell" onClick={this.props.endInning} >
            Field Out
          </button>
        </div>
        <div className="grid-x cell small-4 medium-4 large-6">
          <button id="hit" className="button cell" onClick={this.props.endInning} >
            Hit
          </button>
        </div>
      </div>
    );
  }
}

export default AtBatResult;
