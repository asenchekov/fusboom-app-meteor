import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/App';
import Teams from '../imports/ui/containers/Teams';
import Games from '../imports/ui/containers/Games';

// Meteor.startup(() => {
//   	render(<App />, document.getElementById('app'));
// });

FlowRouter.route('/', {
	name: 'app',
	action() {
		mount(App, {
			template: <Games />
		});
	}
});

FlowRouter.route('/teams', {
	name: 'teams',
	action() {
		mount(App, {
			template: <Teams />
		});
	}
});
