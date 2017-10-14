var { graphql, buildSchema } = require('graphql');
var stories = require('./stories/initData');
var db = require('./db');

var schema = buildSchema(`
    input StoryInput{
        hashtag: String!
        description: String
    }

    type Story{
        hashtag: String!
        description: String
        coverImg: String
    }

    type Query {
        stories: [Story]
    }

    type Mutation {
        createStory(input: StoryInput): Int
    }
`);

var root = {
  stories: () => {
    return db.query('select * from hashtag').then(function(response){
        var rows = response[0];
        return stories;
    });
  },
  createStory: (data) => {
    var input = data.input;
    var hashtag = input.hashtag.replace(/^#/, ''); //removing prepended hashtag
    var sql = "select * from createStory('"+hashtag+"','"+input.description+"')";
    return db.query(sql).then(function(response){
        return response[0][0].storyid;
    }).catch(function(error){
        console.log(error);
    });
  }
};

module.exports = {
    schema: schema,
    root: root
};