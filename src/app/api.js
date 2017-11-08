var { graphql, buildSchema } = require('graphql');
var db = require('../db');
var { createSlug } = require('../utils/simpl');
var { isAuthorized } = require('../actor/auth');

var schema = buildSchema(`
    input StoryInput{
        hashtag: String!
        description: String
        id: Int
    }

    input PartInput{
        story: Int!
        imgKeys: [String!]
        soundcloudUrls: [String!]
        youtubeUrls: [String!]
        vimeoUrls: [String!]
    }

    input PublishInput{
        story: Int!
        isPrivate: Boolean
        allowPayment: Boolean
    }

    type Query {
        test: String
    }

    type Mutation {
        createOrUpdateStory(input: StoryInput): Int
        saveStory(input: PartInput): Int
        publishStory(input: PublishInput): String!
    }
`);

var root = {

  createOrUpdateStory: (data, request) => {
    var input = data.input;
    return isAuthorized('story', request.actor, input.id).then(function(authorized){
        var hashtag = input.hashtag.replace(/^#/, ''); //removing prepended hashtag
        var sql = "select * from createOrUpdateStory('"+hashtag+"','"+input.description+"', "+request.actor+", "+input.id+")";
        console.log(sql);
        return db.query(sql).then(function(response){
            var storyId = response[0][0].storyid;
            var slug = createSlug(storyId, hashtag);
            var sql2 = "select output from getOrCreateUrl("+storyId+", '"+slug+"');";
            return db.query(sql2).then(function(results){
                return storyId;
            });
        }).catch(function(error){
            console.log(error);
        });
    });
  },

  saveStory: (data, request) => {
    var input = data.input; var storyId = input.story;

    return isAuthorized('story', request.actor, storyId).then(function(authorized){

        var imgKeys = input.imgKeys; var soundcloudUrls = input.soundcloudUrls;
        var youtubeUrls = input.youtubeUrls; var vimeoUrls = input.vimeoUrls;
        var imgArrayString = 'ARRAY['; var soundcloudArrayString = 'ARRAY[';
        var youtubeArrayString = 'ARRAY['; var vimeoArrayString = 'ARRAY[';

        for(var i=0; i<imgKeys.length; i++){
            imgArrayString += "'"+imgKeys[i]+"',";
        }
        for(var i=0; i<soundcloudUrls.length; i++){
            soundcloudArrayString += "'"+soundcloudUrls[i]+"',";
        }
        for(var i=0; i<youtubeUrls.length; i++){
            youtubeArrayString += "'"+youtubeUrls[i]+"',";
        }
        for(var i=0; i<vimeoUrls.length; i++){
            vimeoArrayString += "'"+vimeoUrls[i]+"',";
        }

        // removing last comma
        imgArrayString = imgArrayString.slice(0, -1);
        soundcloudArrayString = soundcloudArrayString.slice(0, -1);
        youtubeArrayString = youtubeArrayString.slice(0, -1);
        vimeoArrayString = vimeoArrayString.slice(0, -1);

        if(imgKeys.length === 0){ imgArrayString = 'null'; }
        else{ imgArrayString += "]"; }
        if(soundcloudUrls.length === 0){ soundcloudArrayString = 'null'; }
        else{ soundcloudArrayString += "]"; }
        if(youtubeUrls.length === 0){ youtubeArrayString = 'null' }
        else{ youtubeArrayString += "]"; }
        if(vimeoUrls.length === 0){ vimeoArrayString = 'null' }
        else{ vimeoArrayString += "]"; }

        var sql = "select * from saveStory("+storyId+", "+imgArrayString+", "+soundcloudArrayString+", "+youtubeArrayString+","+vimeoArrayString+")";
        console.log(sql);
        return db.query(sql).then(function(response){
            return response[0][0].output;
        }).catch(function(error){
            console.log(error);
        });

    });
  },

  test: (data, request) => {
    return request.actor;
  },

  publishStory: (data, request) => {
    var input = data.input;
    return isAuthorized('story', request.actor, input.story).then(function(authorized){

        var sql1 = "select hashtag, description from storyView where id="+input.story;
        return db.query(sql1).then(function(results){
            var story = results[0][0];
            var hashtag = story.hashtag.replace(/^#/, ''); //removing prepended hashtag
            var slug = createSlug(input.story, hashtag);
            var sql2 = "select * from publishStory("+input.story+", "+input.isPrivate+", "+input.allowPayment+", '"+slug+"')";
            return db.query(sql2).then(function(results){
                var row = results[0][0];
                return row.slugurl;
            });
        });

    });
  }
};


module.exports = {
    schema: schema,
    root: root
};