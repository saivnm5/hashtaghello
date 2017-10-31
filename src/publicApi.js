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
        slug: String
    }

    type ViewStory{
        id: Int!
        hashtag: String!
        description: String
        createdByName: String
        isPrivate: Boolean
        allowPayment: Boolean
        isPublished: Boolean
        slug: String
        imgKey: String
        thumbnailUrl: String
        parts: [Part]
    }

    type Oembed{
        thumbnail_url: String!,
        html: String!
    }

    type Query {
        stories(self: Boolean, page: Int): [Story]
        test: String
        story(slug: String!): ViewStory
        oembed(url: String!): Oembed
    }
`);

var root = {

  stories: (data, request) => {
    var sql = 'select * from ';
    var pageSize = 5; var offset = 0;
    if(data.page){
        offset = pageSize * data.page;
    }
    if(data.self){
        sql += ' storyView where "createdBy" = '+request.actor;
    }
    else{
        sql += ' storyFeaturedView';
    }

    sql += ' limit '+pageSize+' offset '+offset;
    return db.query(sql).then(function(response){
        var rows = response[0];
        return rows;
    });
  },

  test: (data, request) => {
    return 'juice';
  },

  story: (data) => {
    var response = {};
    var sql = "select story from url where slug = '"+data.slug+"'";
    return db.query(sql).then(function(results){
        var url = results[0][0];
        var sql1 = "select * from storyView where id = "+url.story;
        var sql2 = "select * from partView where story = "+url.story;
        return db.query(sql1).then(function(results){
            var story = results[0][0];
            response.hashtag = story.hashtag;
            response.description = story.description;
            response.createdByName = story.createdByName;
            response.isPrivate = story.isPrivate;
            response.isPublished = story.isPublished;
            response.allowPayment = story.allowPayment;
            response.slug = story.slug;
            response.id = story.id;
            response.imgKey = story.imgKey;
            response.thumbnailUrl = story.thumbnailUrl;
            return db.query(sql2).then(function(results){
                var rows = results[0];
                response.parts = rows;
                return response;
            });
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