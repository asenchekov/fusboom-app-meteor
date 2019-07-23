import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamsCollection } from '../../api/teams';
import { Meteor } from 'meteor/meteor';

import TeamInput from './TeamInput';

const spanStyle = {
    green: {
        margin: '5px',
        padding: '5px',
        color: 'green',
        border: '1px solid white',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '12px'
    },
    red: {
        margin: '5px',
        padding: '5px',
        color: 'red',
        border: '1px solid white',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '12px'
    }
};

class Teams extends Component {
    state = {
        editingId: '',
        name: '',
        isAddingNewTeam: false
    }

    removeTeamHandler = (id) => {
        Meteor.call('teams.remove', id, (err) => {
            if(err) {
                alert(err.message);
            }
        });
    }

    onClickEditHandler = (id, name) => {
        this.setState({editingId: id, name: name});
    }

    onChangeNameHandler = (event) => {
        this.setState({name: event.target.value});

    }

    onSubmitEditedName = () => {
        Meteor.call('teams.update.name', this.state.editingId, this.state.name, (err) => {
            if(err) {
                alert(err.message);
            }
        });
        this.setState({editingId: '', name: ''});

    }

    onCancelNameChenge = () => {
        this.setState({editingId: '', name: ''});
    }

    isAddingNewTeamHandler = (value) => {
        this.setState({isAddingNewTeam: value});
    }

    render() {
        const teams = this.props.teamsData.map(team => {
            if(team._id === this.state.editingId) {
                return (
                    <li key={team._id} 
                        style={{backgroundColor: '#eee', padding: '5px'}}
                    >
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.onChangeNameHandler}
                        />
                        <span
                            style={spanStyle.green}
                            onClick={this.onSubmitEditedName}
                        >
                            OK
                        </span>
                        <span
                            style={spanStyle.red}
                            onClick={this.onCancelNameChenge}
                        >
                            CANCEL
                        </span>
                    </li>
                );
            } else {
                return (
                    <li
                        style={{backgroundColor: '#eee', padding: '5px'}}
                        key={team._id}>
                        {team.name}
                        <span
                            style={spanStyle.green}
                            onClick={(teamId, name) => this.onClickEditHandler(team._id, team.name)}>
                            EDIT
                        </span>
                        <span
                            style={spanStyle.red}
                            onClick={(teamId) => this.removeTeamHandler(team._id)}>
                            X
                        </span>
                    </li>
                );
            }
        });

        return (
            <div>
                <h2>Teams</h2>
                <TeamInput toggleNewTeam={this.isAddingNewTeamHandler} />
                <ul>
                    {teams}
                    { 
                        this.state.isAddingNewTeam
                        ? <li key="adding">Adding tam now...</li>
                        : null
                    }
                </ul>
            </div>
        );
    };
}

export default withTracker(() => {
    Meteor.subscribe('teams');
    return {
        teamsData: TeamsCollection.find({}, { sort: { createdAt: -1 }}).fetch(),
    };
})(Teams);
