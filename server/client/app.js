import React, { Component } from "react";
import $ from "jquery";

class LampCollection extends Component {
    render() {
        return (
            <div className="container">{this.props.children}</div>
        );
    }
};

class Lamp extends Component {
    constructor(props) {
        super(props);
        this.command = this.command.bind(this);
    }

    command(on_off_n) {
        $.get("/lamp", {lamp:this.props.index, state:on_off_n?"on":"off"})
        .then((data) => {
            console.log("Got data: " + JSON.stringify(data));
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-2 text-center">Lamp {this.props.name}</div>
                <div className="col btn btn-light w-50" onClick={() => this.command(true)}>ON</div>
                <div className="col btn btn-dark w-50" onClick={() => this.command(false)}>OFF</div>
            </div>
        );
    }
};

class App extends Component {
	render() {
		return (
            <>
			<div>REACT stuffs</div>
            <LampCollection>
                <Lamp index={1} name="1"/>
                <Lamp index={2} name="2"/>
                <Lamp index={3} name="3"/>
                <Lamp index="all" name="group"/>
            </LampCollection>
            </>
		);
	}
};

export default App;
