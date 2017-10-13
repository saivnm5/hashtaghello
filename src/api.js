var { graphql, buildSchema } = require('graphql');
var stories = require('./stories/initData');

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
    return stories;
  },
};

module.exports = {
    schema: schema,
    root: root
};