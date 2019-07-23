import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamsCollection } from '../../api/teams';
import { Meteor } from 'meteor/meteor';


class GameInput extends Component {
    state = {
        createNewGame: false,
        teamOne: '',
        teamTwo: '',
    }

    onCreateGameToggle = () => {
        this.setState({teamOne: '', teamTwo: ''});
        this.setState({createNewGame: !this.state.createNewGame,});
    }

    onSubmitGameHandler = () => {
        event.preventDefault();
        let team1 = this.state.teamOne
        let team2 = this.state.teamTwo;
        if(team1 === team2) {
            alert("Can't make a game with only one team");
        } else if(!team1 || !team2) {
            alert("Team selections can't be empty")
        } else {
            Meteor.call('games.insert', team1, team2, Meteor.userId(), (err) => {
                if(err) {
                    alert(err.message);
                }
            });
            this.setState({teamOne: '', teamTwo: ''});
        }
    }

    onChangeTeam1Handler = (event) => {
        this.setState({teamOne: event.target.value});
    }

    onChangeTeam2Handler = (event) => {
        this.setState({teamTwo: event.target.value});
    }

    render() {
        const options = this.props.teamsData.map(team => {
            return <option
                key={team._id}
                value={team._id}
            >
                {team.name}
            </option>
        });

        let createNewGame = (
            <div
                style={{
                    cursor: 'pointer',
                    border: '1px solid blue',
                    width: '30%',
                    textAlign: 'center' 
                }}
                onClick={this.onCreateGameToggle}>
                Create new Game...
            </div>
        );

        if(this.state.createNewGame) {
            createNewGame = (
                <div className="formWrap">
                    <form onSubmit={this.onSubmitGameHandler} >
                        <select
                            value={this.state.teamOne}
                            onChange={this.onChangeTeam1Handler}
                        >
                            <option key="default1" default value=''></option>
                            {options}
                        </select>
                        vs
                        <select
                        value={this.state.teamTwo}
                            onChange={this.onChangeTeam2Handler}
                        >
                            <option key="default2" default value=''></option>
                            {options}
                        </select>
                        <button type="submit">Submit</button>
                        <span onClick={this.onCreateGameToggle}>Cancel...</span>
                    </form>
                </div>
            );
        }
        return createNewGame;
    }
}

export default withTracker(() => {
    Meteor.subscribe('teams');
    return {
        teamsData: TeamsCollection.find({}).fetch(),
    };
})(GameInput);
