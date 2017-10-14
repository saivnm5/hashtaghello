var { graphql, buildSchema } = require('graphql');
var stories = require('./stories/initData');
var db = require('./db');

var schema = buildSchema(`
    type Story{
        hashtag: String!
        description: String
        coverImg: String
    }

    type Query {
        stories: [Story]
    }
`);

var root = {
  stories: () => {
    db.query('select * from hashtag').then(function(response){
        var rows = response[0];
    });
    return stories;
  },
};

module.exports = {
    schema: schema,
    root: root
};