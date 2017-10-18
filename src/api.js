var { graphql, buildSchema } = require('graphql');
var stories = require('./stories/initData');
var db = require('./db');

var schema = buildSchema(`
    input StoryInput{
        hashtag: String!
        description: String
    }

    input ShotInput{
        story: Int!
        shots: [String!]
    }

    input ActorInput{
        name: String!
        email: String
        fbUserId: String!
    }

    type Story{
        hashtag: String!
        description: String
        imgKey: String
    }

    type Query {
        stories: [Story]
        test: String
    }

    type Mutation {
        createStory(input: StoryInput): Int
        saveStory(input: ShotInput): Int
        createActor(input: ActorInput): Int
    }
`);

var root = {
  stories: () => {
    return db.query('select * from storyView').then(function(response){
        var rows = response[0];
        return rows;
    });
  },
  createStory: (data, request) => {
    var input = data.input;
    var hashtag = input.hashtag.replace(/^#/, ''); //removing prepended hashtag
    var sql = "select * from createStory('"+hashtag+"','"+input.description+"', "+request.actor+")";
    return db.query(sql).then(function(response){
        return response[0][0].storyid;
    }).catch(function(error){
        console.log(error);
    });
  },
  saveStory: (data) => {
    var input = data.input;
    var storyId = input.story;
    var shots = input.shots;
    var shotsArrayString = '';
    for(var i=0; i<shots.length; i++){
        shotsArrayString += "'"+shots[i]+"',";
    }
    shotsArrayString = shotsArrayString.slice(0, -1); // removing the last comma

    var sql = "select * from saveStory("+storyId+", ARRAY["+shotsArrayString+"])";

    return db.query(sql).then(function(response){
        return response[0][0].success;
    }).catch(function(error){
        console.log(error);
    });

  },
  createActor: (data) => {
    var input = data.input;
    var email = "null";
    if(input.email){ email = "'"+input.email+"'"; }

    var sql = "select * from createActor('"+input.name+"',"+email+",'"+input.fbUserId+"')";
    return db.query(sql).then(function(response){
        return response[0][0].actor;
    }).catch(function(error){
        console.log(error);
    });
  },
  test: (data, request) => {
    return request.actor;
  }
};

function authMiddleware(req, res, next) {
    var authToken = req.get('Authorization');
    var sql = "select * from getActor('"+authToken+"')";
    db.query(sql).then(function(response){
        if(response[0][0].actor){
            req.actor = response[0][0].actor;
        }
        next();
    });
}

module.exports = {
    schema: schema,
    root: root,
    authMiddleware: authMiddleware
};