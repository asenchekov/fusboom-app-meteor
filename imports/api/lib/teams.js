import { Meteor } from "meteor/meteor";
import { TeamsCollection } from "../teams";
import { GamesCollection } from "../games";
import { check } from "meteor/check"


Meteor.methods({
    'teams.insert'(name, ownerId) {
        check(name, String);
        check(ownerId, String);
        TeamsCollection.insert({
            name: name,
            gameIds: [],
            ownerId: ownerId,
            createdAt: new Date()
        });
    },
    'teams.update.name'(id, name) {
        check(id, String);
        check(name, String);
        TeamsCollection.update({
            "_id": id
        },
        {
            $set: {
                "name": name
            }
        });
    },
    'teams.remove'(id) {
        check(id, String);
        const team = TeamsCollection.findOne({_id: id});
        team.gameIds.forEach(game => {
            GamesCollection.remove({_id: game});
        });
        TeamsCollection.remove({
            "_id": id
        });
    }
});