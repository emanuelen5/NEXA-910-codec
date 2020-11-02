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
            this.props.on_response(data);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-2">Lamp {this.props.name}</div>
                <div className="col btn btn-light w-50" onClick={() => this.command(true)}>ON</div>
                <div className="col btn btn-dark w-50" onClick={() => this.command(false)}>OFF</div>
                {this.props.editable &&
                    <div className="col btn bg-danger text-white col-sm-1"><i className="fa fa-trash"></i></div>
                }
            </div>
        );
    }
};

class LampResult extends Component {
    render() {
        const responseText = this.props.has_response ? "Response: " + JSON.stringify(this.props.response) : "Ready";
        return (
            <div className="row">
                <div className="col text-info text-center">
                    {responseText}
                </div>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.response = this.response.bind(this);
        this.state = {
            editable: false,
            has_response: false,
            response: "Ready",
            switches: props.switches || []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({editable: event.target.checked});
    }

    response(data) {
        this.setState({response: data, has_response: true});
    }

	render() {
        let lamps = this.state.switches.value.map(s => {
            const key = s.name + " " + s.group;
            const name = s.name == 'all' ? 'group' : s.name;
            return <Lamp index={s.name} name={name} on_response={this.response} key={key} editable={this.state.editable}></Lamp>;
        });
		return (
            <>
            <input type="checkbox" value={this.state.value} onChange={this.handleChange} />
            <LampCollection>
			    <h1 className="display-4 text-center">NEXA control page</h1>
                {lamps}
                <LampResult has_response={this.state.has_response} response={this.state.response}/>
            </LampCollection>
            </>
		);
	}
};

export default App;
