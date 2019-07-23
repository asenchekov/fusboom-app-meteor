import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Provider } from 'react-redux';
import store from '../store/store';

import Header from './components/Header';
import AccountsUIWrapper from './containers/AccountsUIWrapper';
import { Meteor } from 'meteor/meteor';

class App extends Component {
  state = { 
    gamesLink: 'active',
    teamsLink: ''
  }

  linkClickHandler = (a) => {
    if(a === "games") {
      this.setState({gamesLink: 'active', teamsLink: ''});

    }
    if(a === "teams") { 
      this.setState({gamesLink: '', teamsLink: 'active'});
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Header />
        <ul>
          <li><a onClick={(a) => this.linkClickHandler("games")} className={this.state.gamesLink} href="/">Games</a></li>
          <li><a onClick={(a) => this.linkClickHandler("teams")} className={this.state.teamsLink} href="/teams">Teams</a></li>
        </ul>
        <AccountsUIWrapper />
        {this.props.currentUser ? this.props.template : <h1>Please Sign in to Use</h1>}
      </Provider>
    );
  };
}

export default withTracker(() => {
  return {
    currentUser: Meteor.userId()
  };
})(App);