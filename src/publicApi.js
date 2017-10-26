var { graphql, buildSchema } = require('graphql');
var db = require('./db');
var { getRootDomain } = require('./utils/simpl');
var axios = require('axios');

var schema = buildSchema(`

    type Part{
        imgKey: String
        thumbnailUrl: String
        mediaUrl: String
    }

    type Story{
        id: Int!
        hashtag: String!
        creator: String
        description: String
        imgKey: String
        thumbnailUrl: String
        mediaUrl: String
    }

    type ViewStory{
        hashtag: String!
        description: String
        creator: String
        slug: String
        parts: [Part]
    }

    type Oembed{
        thumbnail_url: String!,
        html: String!
    }

    type Query {
        stories: [Story]
        test: String
        story(id: Int!): ViewStory
        oembed(url: String!): Oembed
    }
`);

var root = {

  stories: () => {
    return db.query('select * from storyView').then(function(response){
        var rows = response[0];
        return rows;
    });
  },

  test: (data, request) => {
    return request.actor;
  },

  story: (data) => {
    var sql1 = "select * from storyView where id = "+data.id;
    var sql2 = "select * from partView where story = "+data.id;
    var response = {};

    return db.query(sql1).then(function(results){
        var story = results[0][0];
        response.hashtag = story.hashtag;
        response.description = story.description;
        response.creator = story.creator;
        response.slug = story.slug;
        return db.query(sql2).then(function(results){
            var rows = results[0];
            response.parts = rows;
            return response;
        });
    });

  },

  oembed: (data) => {
    var url = data.url;
    var domain = getRootDomain(url);
    return axios.get('http://'+domain+'/oembed', {
        params: {
          url: url,
          format: 'json'
        }
    })
    .then(function (response) {
        console.log(response);
        var data = {};
        data.thumbnail_url = response.data.thumbnail_url;
        data.html = response.data.html;
        return data;
    })
    .catch(function (error) {
        console.log(error);
    });
  }
};


module.exports = {
    schema: schema,
    root: root
};