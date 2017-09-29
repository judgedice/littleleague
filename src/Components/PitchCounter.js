import React from "react";

var stateObject = {
  currentInning: 2,
  currentPitchCount: 0,
  pitchesThisInning: [],
  pitchInQueue: {} // single pitch object that can be modified
};

class PitchCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateObject;
  }

  modifyPitch(e) {
    e.preventDefault();
    //TODO... MODIFY THE PITCH IN QUEUE WITH THE PITCH TYPE
  }

  render() {
    return (
      <div
        id="PitchCounter"
        className="small-12 medium-12 large-12 grid-x grid-y pitch-count-buttons"
      >
        <div className="cell align-center auto grid-x grid-margin-x">
          <button
            id="strike"
            className="button cell  small-6 count-button"
            onClick={this.props.addNewPitch}
          >
            Strike
          </button>
          <button
            id="ball"
            className="button cell small-6 count-button"
            onClick={this.props.addNewPitch}
          >
            Ball
          </button>
        </div>
        <div className="grid-x grid-margin-x text-center cell">
          <button
            id="remove"
            className="button cell secondary"
            onClick={this.props.addNewPitch}
          >
            Remove Pitch
          </button>
        </div>
      </div>
    );
  }
}

export default PitchCounter;

// FUTURE FEATURE: MODIFY THE PITCH TYPE WITH THE FOLLOWING:

//  <div className="grid-container">
//                         <button id="curve" onClick={this.modifyPitch} className="button tiny">Curve</button>
//                         <button id="fastBall" onClick={this.modifyPitch} className="button tiny">Fastball</button>
//                         <button id="ChangeUp" onClick={this.modifyPitch} className="button tiny">ChangeUp</button>
//                         <button id="Slider" onClick={this.modifyPitch} className="button tiny">Slider</button>
//                         <button id="KnuckleBall" onClick={this.modifyPitch} className="button tiny">KnuckleBall</button>
//                         <button id="ScrewBall" onClick={this.modifyPitch} className="button tiny">ScrewBall</button>
//                     </div>
