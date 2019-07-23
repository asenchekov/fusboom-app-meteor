import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';

import { TeamsCollection } from '../../api/teams';
import { GamesCollection } from '../../api/games';
import { Meteor } from 'meteor/meteor';
import {red, green} from './GamesStyles.js';

import GameInput from './GameInput';

class Games extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'AUTHENTICATING'});
        this.props.dispatch({type: 'AUTH_SUCCESS', payload: true});
    }

    state = {
        editingGameId: ''
    }

    onChangeScore = (id, teamIndex, operator) => {
        Meteor.call('games.update.score', id, teamIndex, operator);
    }

    onFinishGame = (id) => {
        Meteor.call('games.finish', id);
    }
    
    onDeleteGame = (id, teamOne, teamTwo) => {
        Meteor.call('games.remove', id, teamOne, teamTwo);
    }

    render() {
        console.log(this.props.isAuthed);
        let games = <h1>No Games at this moment!</h1>;
        if(this.props.gamesData.length) {
            games = this.props.gamesData.map(game => {
                if(game.completed) {
                    return (
                        <li key={game._id} 
                            style={{backgroundColor: '#eee', padding: '5px'}}
                        >
                            {TeamsCollection.findOne({_id: game.teams[0].teamId}).name} :
                            <span style={{...red, fontSize: '16px', cursor: 'initial'}}>{game.teams[0].score}</span>
                            vs {TeamsCollection.findOne({_id: game.teams[1].teamId}).name} :
                            <span style={{...red, fontSize: '16px', cursor: 'initial'}}>{game.teams[1].score}</span>
                        </li>
                    );
                } else {
                    return (
                        <li key={game._id} 
                            style={{backgroundColor: '#eee', padding: '5px'}}
                        >
                            {TeamsCollection.findOne({_id: game.teams[0].teamId}).name} :
                            {
                                game.teams[0].score > 0
                                ? <span
                                    style={{...red, fontSize: '16px'}}
                                    onClick={(id, teamIndex, operator) => this.onChangeScore(game._id, 0, '-')}
                                >-</span>
                                : <span style={{...red, fontSize: '16px'}}>-</span>
                            }
                            <span >{game.teams[0].score}</span>
                            <span style={{...green, fontSize: '16px'}} onClick={(id, teamIndex, operator) => this.onChangeScore(game._id, 0, '+')}>+</span>
                            vs {TeamsCollection.findOne({_id: game.teams[1].teamId}).name} :
                            {
                                game.teams[1].score > 0
                                ? <span style={{...red, fontSize: '16px'}} onClick={(id, teamIndex, operator) => this.onChangeScore(game._id, 1, '-')}
                                >-</span>
                                : <span style={{...red, fontSize: '16px'}}>-</span>
                            }
                            <span >{game.teams[1].score}</span>
                            <span style={{...green, fontSize: '16px'}} onClick={(id, teamIndex, operator) => this.onChangeScore(game._id, 1, '+')}>+</span>
                            <span style={green} onClick={(id) => this.onFinishGame(game._id)}>FINISHED</span>
                            <span style={red} onClick={(id, teamOne, teamTwo) => this.onDeleteGame(game._id, game.teams[0].teamId, game.teams[1].teamId)}>X</span>
                        </li>
                    );
                }
            });
        }

        return (
            <div>
                <h2>Games</h2>
                <GameInput />
                <ul>
                    {games}
                </ul>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.isAuthed
    }
}; 

export default withTracker(() => {
    Meteor.subscribe('games');
    Meteor.subscribe('teams');
    return {
        gamesData: GamesCollection.find({}, { sort: { createdAt: -1 }}).fetch() || [],
        teamsData: TeamsCollection.find({}, { sort: { createdAt: -1 }}).fetch() || []
    };
})(connect(mapStateToProps)(Games));

