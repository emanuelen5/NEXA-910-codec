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
        $.get("/api/lamp", {lamp:this.props.index, state:on_off_n?"on":"off"})
        .then((data) => {
            this.props.on_response(data);
        });
    }

    render() {
        const icon =  this.props.is_group ? {on: "mdi-lightbulb-group", off: "mdi-lightbulb-group-off"} : {on: "mdi-lightbulb-on", off: "mdi-lightbulb-off"};
        return (
            <div className="row">
                <div className="col-sm-2">Lamp {this.props.name}</div>
                <div className="col btn btn-light w-50" onClick={() => this.command(true)}>
                    <i className={`mdi ${icon['on']}`} aria-hidden="true"></i>
                    ON
                </div>
                <div className="col btn btn-dark w-50" onClick={() => this.command(false)}>
                    <i className={`mdi ${icon['off']}`} aria-hidden="true"></i>
                    OFF
                </div>
                {this.props.editable &&
                    <div className="col btn btn-danger text-white col-sm-1" onClick={this.props.on_delete}><i className="fa fa-trash"></i></div>
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

function EditMenu(props) {
    return (
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="edit_enable_checkbox" value="editable" value={props.value} onChange={props.onChange}/>
            <label className="form-check-label" htmlFor="edit_enable_checkbox">Enable edit</label>
        </div>
    )
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
        this.deleteRow = this.deleteRow.bind(this);
        console.log(this.state.switches)
    }

    handleChange(event) {
        this.setState({editable: event.target.checked});
    }

    response(data) {
        this.setState({response: data, has_response: true});
    }

    deleteRow(id_) {
        this.state.switches.value.splice(id_, 1);
        this.forceUpdate();
    }

	render() {
        let index = 0;
        let lamps = this.state.switches.value.map(s => {
            const key = s.name + " " + s.group;
            const is_group = s.name == "all";
            const name = is_group ? 'group' : s.name;
            const lamp = ((idx) => <Lamp index={s.name} is_group={is_group} name={name} on_response={this.response} key={key} id_={key} on_delete={() => this.deleteRow(idx)} editable={this.state.editable}></Lamp>)(index);
            index += 1;
            return lamp
        });
		return (
            <>
            <LampCollection>
			    <h1 className="display-4 text-center">
                    NEXA control page
                </h1>
                <EditMenu value={this.state.editable} onChange={this.handleChange}/>
                {lamps}
                <LampResult has_response={this.state.has_response} response={this.state.response}/>
            </LampCollection>
            </>
		);
	}
};

export default App;
