import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class UserInput extends Component {
    state = {
        id: null,
        createNewTeam: false,
        input: ''
    }
    
    onSubmithandler = (event) => {
        event.preventDefault();
        if(this.state.input) {
            Meteor.call('teams.insert', this.state.input, Meteor.userId(), (err) => {
               if(err) {
                   alert(err.message);
               }
            });
            this.setState({input: ''});
        }
    }

    onInputChangeHnadler = (event) => {
        event.preventDefault();
        this.setState({input: event.target.value});
    }

    onCreateTeamToggle = () => {
        this.setState({createNewTeam: !this.state.createNewTeam, input: ''});
    }
    
    render() {
        let createNewTeam = (
            <div
                style={{
                    cursor: 'pointer',
                    border: '1px solid blue',
                    width: '30%',
                    textAlign: 'center' 
                }}
                onClick={this.onCreateTeamToggle}>
                Create new Team...
            </div>
        );

        if(this.state.createNewTeam) {
            createNewTeam = (
                <div className="formWrap">
                    <form onSubmit={this.onSubmithandler}>
                        <input
                            onChange={this.onInputChangeHnadler}
                            onFocus={(value) => this.props.toggleNewTeam(true)}
                            onBlur={(value) => this.props.toggleNewTeam(false)}
                            value={this.state.input}
                            type="text" placeholder="Adding team..."
                        />
                        <button type="submit">Submit</button>
                        <span onClick={this.onCreateTeamToggle}> Cancel...</span>
                    </form>
                </div>
            );
        }

        return createNewTeam;
    }
}

export default UserInput;
