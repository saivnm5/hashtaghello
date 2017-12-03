var { graphql, buildSchema } = require('graphql');
var db = require('../db');
var { getRootDomain } = require('../utils/simpl');
var axios = require('axios');

var schema = buildSchema(`

    type Part{
        imgKey: String
        thumbnailUrl: String
        mediaUrl: String
        text: String
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

    input PaymentInput{
        storySlug: String!
        amount: Float!
        buyerName: String!
    }

    type Query {
        stories(type: String, page: Int): [Story]
        test: String
        story(slug: String!): ViewStory
        oembed(url: String!): Oembed
    }

    type Mutation {
        getPaymentLink(input: PaymentInput): String
    }
`);

var root = {

  stories: (data, request) => {
    var sql = 'select * from ';
    var pageSize = 10; var offset = 0;

    if(data.type === 'self'){
        sql += ' storyView where "createdBy" = '+request.actor;
    }
    else if(data.type === 'featured'){
        sql += ' storyFeaturedView';
    }
    else if(data.type === 'public'){
        sql += ' storyPublicView';
    }

    if(data.page){
        offset = pageSize * data.page;
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
    // select story from getStory(slug, accessToken, request.actor)
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
  },

  getPaymentLink: (data) => {
    var input = data.input;
    var apiRoot = 'https://www.instamojo.com/api/1.1/payment-requests/';
    var headers = {
        "X-Api-Key" : "b627e32eb0c9a9ea11eb31c03d8fba57",
        "X-Auth-Token" : "045e3ffe31f1f5e7a5ee9dd0ae45db76"
    };

    var sql = "select story from url where slug = '"+input.storySlug+"'";
    return db.query(sql).then(function(results){
    if(results[0][0]){

        var url = results[0][0];
        var data = {
            amount: input.amount,
            purpose: 'Story ID - '+url.story,
            buyer_name: input.buyerName,
            redirect_url: 'http://hashtaghello.in'
        };

        return axios({
            method: 'post',
            url: apiRoot,
            data: data,
            headers: headers
        }).then(function(response){

          var data = response.data;
          var link = data.payment_request.longurl;
          var requestId = data.payment_request.id;
          var sql = "select * from createPaymentRequest( "+url.story+", "+input.amount+", '"+input.buyerName+"', '"+requestId+"')";

          return db.query(sql).then(function(results){
            if(results[0][0].paymentid){
                return link;
            }
            else{
                return null
            }
          });

        }).catch(function(errors){
            console.log(errors.response.data);
        });
    }
    });
  }
};


module.exports = {
    schema: schema,
    root: root
};