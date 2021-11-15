import React, { Component } from "react";
import $ from "jquery";

const GROUP_INDEX = 'all';

class LampCollection extends Component {
    render() {
        return (
            <div className="container d-flex flex-column min-vh-100">{this.props.children}</div>
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
        const is_group = this.props.index == GROUP_INDEX;
        const icon =  is_group ? {on: "mdi-lightbulb-group", off: "mdi-lightbulb-group-off"} : {on: "mdi-lightbulb-on", off: "mdi-lightbulb-off"};
        const name = is_group ? this.props.lampstate.name + ' (group)' : this.props.lampstate.name;
        return (<>
            <div className="row">
                <div className="col-sm-2">{name}</div>
                <div className="col btn btn-light w-50" onClick={() => this.command(true)}>
                    <i className={`mdi ${icon['on']}`} aria-hidden="true"></i>
                    ON
                </div>
                <div className="col btn btn-dark w-50" onClick={() => this.command(false)}>
                    <i className={`mdi ${icon['off']}`} aria-hidden="true"></i>
                    OFF
                </div>
            </div>
            {this.props.editable && <>
                <div className="row">
                    <input type="text" className="col" value={this.props.lampstate.name} onChange={this.props.on_change_name}></input>
                    <select value={this.props.lampstate.index} onChange={this.props.on_change_index} className="col">
                        {[[1, "1"], [2, "2"], [3, "3"], [GROUP_INDEX, "group"]].map(v => <option key={v[0]} value={v[0]}>{v[1]}</option>)}
                    </select>
                    <input type="text" className="col" value={this.props.lampstate.group} onChange={this.props.on_change_group}></input>
                    <div className="col btn btn-danger text-white col-sm-1" onClick={this.props.on_delete}><i className="fa fa-trash"></i></div>
                </div>
            </>}
        </>);
    }
};

class LampResult extends Component {
    render() {
        const responseText = this.props.has_response ? "Response: " + JSON.stringify(this.props.response) : "Ready";
        return (
            <div className="row container">
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
        this.setName = this.setName.bind(this);
        this.setIndex = this.setIndex.bind(this);
        this.setGroup = this.setGroup.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
    }

    handleChange(event) {
        this.setState({editable: event.target.checked});
    }

    response(data) {
        this.setState({response: data, has_response: true});
    }

    setName(id_, name) {
        this.state.switches.value[id_].name = name;
        this.setState({switches: this.state.switches});
    }

    setIndex(id_, index) {
        this.state.switches.value[id_].index = index;
        this.setState({switches: this.state.switches});
    }

    setGroup(id_, group) {
        this.state.switches.value[id_].group = group;
        this.setState({switches: this.state.switches});
    }

    deleteRow(id_) {
        this.state.switches.value.splice(id_, 1);
        this.setState({switches: this.state.switches});
    }

	render() {
        let index = 0;
        let lamps = this.state.switches.value.map(s => {
            const lamp = ((idx) => <Lamp index={s.index} name={s.name} lampstate={s} on_response={this.response} key={idx} 
                on_delete={() => this.deleteRow(idx)} editable={this.state.editable} on_change_index={(e) => this.setIndex(idx, e.target.value)} on_change_name={(e) => this.setName(idx, e.target.value)} on_change_group={e => this.setGroup(idx, e.target.value)}/>)(index);
            index += 1;
            return lamp;
        });
		return (
            <>
            <LampCollection>
			    <h1 className="display-4 text-center">
                    NEXA control page
                </h1>
                {lamps}
                <LampResult has_response={this.state.has_response} response={this.state.response}/>
                <div className="flex-grow-1"></div>
                <EditMenu value={this.state.editable} onChange={this.handleChange}/>
            </LampCollection>
            </>
		);
	}
};

export {App, GROUP_INDEX};
export default App;
