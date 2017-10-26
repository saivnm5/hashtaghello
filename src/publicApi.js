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
        createdByName: String
        description: String
        imgKey: String
        thumbnailUrl: String
        mediaUrl: String
    }

    type ViewStory{
        hashtag: String!
        description: String
        createdByName: String
        isPrivate: Boolean
        allowPayment: Boolean
        isPublished: Boolean
        slug: String
        parts: [Part]
    }

    type Oembed{
        thumbnail_url: String!,
        html: String!
    }

    type Query {
        stories(self: Boolean, page: Int): [Story]
        test: String
        story(id: Int!): ViewStory
        oembed(url: String!): Oembed
    }
`);

var root = {

  stories: (data, request) => {
    var sql = 'select * from storyView';
    var pageSize = 5; var offset = 0;
    if(data.page){
        offset = pageSize * data.page;
    }
    if(data.self){
        sql += ' where "createdBy" = '+request.actor;
    }
    sql += ' limit '+pageSize+' offset '+offset;
    console.log(sql);
    return db.query(sql).then(function(response){
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
        response.createdByName = story.createdByName;
        response.isPrivate = story.isPrivate;
        response.isPublished = story.isPublished;
        response.allowPayment = story.allowPayment;
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
    var oembedApiUrl = null;
    if(domain === 'youtube.com' || domain === 'soundcloud.com'){
        oembedApiUrl = 'http://'+domain+'/oembed';
    }
    else if(domain === 'vimeo.com'){
        oembedApiUrl = 'https://vimeo.com/api/oembed.json';
    }
    return axios.get(oembedApiUrl, {
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