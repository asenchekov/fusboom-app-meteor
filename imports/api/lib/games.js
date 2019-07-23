import { Meteor } from "meteor/meteor";
import { GamesCollection } from "../games";
import { TeamsCollection } from "../teams";
import { check } from "meteor/check";

Meteor.methods({
    'games.insert'(teamOneId, teamTwoId, ownerId) {
        check(teamOneId, String);
        check(teamTwoId, String);
        check(ownerId, String);
        const game = {
            completed: false,
            teams: [{teamId: teamOneId, score: 0}, {teamId: teamTwoId, score: 0}],
            ownerId: ownerId,
            createdAt: new Date(),
            startedAt: new Date(),
        };
        const gameId = GamesCollection.insert(game);
        TeamsCollection.update({_id: teamOneId}, {$addToSet: {gameIds: gameId}});
        TeamsCollection.update({_id: teamTwoId}, {$addToSet: {gameIds: gameId}});
    },
    'games.update.score'(id, index, operator) {
        check(id, String);
        check(index, Number);
        check(operator, String);
        const teamIndex = "teams." + index + ".score";
        if(operator === '+') {
            GamesCollection.update({
                _id: id
            }, {
                $inc : {[teamIndex]: 1}
            });
        } else {
            GamesCollection.update({
                _id: id
            }, {
                $inc : {[teamIndex]: -1}
            });
        }
        
    },
    'games.remove'(id, teamOne, teamTwo) {
        check(id, String);
        check(teamOne, String);
        check(teamTwo, String);
        GamesCollection.remove({_id: id}, (error) => {
            if(!error) {
                TeamsCollection.update({_id: teamOne}, {$pull: {gameIds: id}});
                TeamsCollection.update({_id: teamTwo}, {$pull: {gameIds: id}});
            }
        });
    },
    'games.finish'(id) {
        check(id, String);
        GamesCollection.update(
            {_id: id},
            {
                $set: {
                    completed: true,
                    finishedAt: new Date()
                }
            }
        );
    }
});