import { Meteor } from 'meteor/meteor';
import '../imports/api/teams';
import '../imports/api/games';
import '../imports/api/lib/teams';
import '../imports/api/lib/games';
import './publications';

Meteor.startup(() => {
  // code to run on server at startup
});
