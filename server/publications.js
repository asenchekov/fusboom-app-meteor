import { Meteor } from "meteor/meteor";
import { TeamsCollection } from "../imports/api/teams";
import { GamesCollection } from "../imports/api/games";

Meteor.publish('teams', () => {
    return TeamsCollection.find({ownerId: Meteor.userId()});
});

Meteor.publish('games', () => {
    return GamesCollection.find({ownerId: Meteor.userId()});
});