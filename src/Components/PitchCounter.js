import React from 'react';

var stateObject = {
    currentInning: 2,
    currentPitchCount: 0,
    pitchesThisInning: [],
    pitchInQueue: {} // single pitch object that can be modified
};


class PitchCounter extends React.Component {
    constructor(props) {
        super(props)
        this.state = stateObject
    }

    modifyPitch(e) {
        e.preventDefault()
        //TODO... MODIFY THE PITCH IN QUEUE WITH THE PITCH TYPE
    }



    render() {
        return (
            <div>
                <div className="grid-container">
                    <div className="grid-x grid-margin-x">
                        <button id="ball" className="button cell small-6" onClick={this.props.addNewPitch} >Ball</button>
                        <button id="strike" className="button cell small-6" onClick={this.props.addNewPitch} >Strike</button>
                    </div>
                    <div className="grid-x grid-margin-x">
                        <button id="remove" className="button tiny small-6 large-4 cell " onClick={this.addNewPitch}>Remove Pitch</button>
                        <button className="button tiny small-6 large-4 cell alert" onClick={this.props.endInning} >End Inning</button>
                    </div>
                   
                </div>


            </div>
        );
    }
};

export default PitchCounter


// FUTURE FEATURE: MODIFY THE PITCH TYPE WITH THE FOLLOWING:

//  <div className="grid-container">
//                         <button id="curve" onClick={this.modifyPitch} className="button tiny">Curve</button>
//                         <button id="fastBall" onClick={this.modifyPitch} className="button tiny">Fastball</button>
//                         <button id="ChangeUp" onClick={this.modifyPitch} className="button tiny">ChangeUp</button>
//                         <button id="Slider" onClick={this.modifyPitch} className="button tiny">Slider</button>
//                         <button id="KnuckleBall" onClick={this.modifyPitch} className="button tiny">KnuckleBall</button>
//                         <button id="ScrewBall" onClick={this.modifyPitch} className="button tiny">ScrewBall</button>
//                     </div>