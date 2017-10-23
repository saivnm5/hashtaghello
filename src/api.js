var { graphql, buildSchema } = require('graphql');
var stories = require('./stories/initData');
var db = require('./db');
var { getRootDomain } = require('./utils/simpl');
var axios = require('axios');

var schema = buildSchema(`
    input StoryInput{
        hashtag: String!
        description: String
        id: Int
    }

    input PartInput{
        story: Int!
        imgKeys: [String!],
        soundcloudUrls: [String!],
        youtubeUrls: [String!],
        vimeoUrls: [String!]
    }

    input ActorInput{
        name: String!
        email: String
        fbUserId: String!
    }

    type Part{
        imgKey: String
        soundcloudUrl: String,
        youtubeUrl: String,
        vimeoUrl: String
    }

    type Story{
        id: Int!
        hashtag: String!
        description: String
        imgKey: String
    }

    type ViewStory{
        hashtag: String!
        description: String
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

    type Mutation {
        createOrUpdateStory(input: StoryInput): Int
        saveStory(input: PartInput): Int
        getOrCreateActor(input: ActorInput): Int
    }
`);

var root = {

  stories: () => {
    return db.query('select * from storyView').then(function(response){
        var rows = response[0];
        return rows;
    });
  },

  createOrUpdateStory: (data, request) => {
    var input = data.input;
    var hashtag = input.hashtag.replace(/^#/, ''); //removing prepended hashtag
    var sql = "select * from createOrUpdateStory('"+hashtag+"','"+input.description+"', "+request.actor+", "+input.id+")";
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

  getOrCreateActor: (data) => {
    var input = data.input;
    var email = "null";
    if(input.email){ email = "'"+input.email+"'"; }

    var sql = "select * from getOrCreateActor('"+input.name+"',"+email+",'"+input.fbUserId+"')";
    return db.query(sql).then(function(response){
        return response[0][0].actor;
    }).catch(function(error){
        console.log(error);
    });
  },

  test: (data, request) => {
    return request.actor;
  },

  story: (data) => {
    var sql1 = "select * from storyView where id = "+data.id;
    var sql2 = "select * from part where story = "+data.id+" order by \"order\" asc";
    var response = {};

    return db.query(sql1).then(function(results){
        var story = results[0][0];
        response.hashtag = story.hashtag;
        response.description = story.description;
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