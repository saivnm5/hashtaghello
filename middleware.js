var fs = require('fs');
var db = require('./src/db');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var indexName ='./build/index.html';
var { getImgUrl } = require('./src/utils/simpl');

function updateMeta(next, title, description, url, image){
	console.log(url);
	JSDOM.fromFile(indexName).then(dom => {
		var doc = dom.window.document;
		if(doc.querySelector('meta[name="og:url"]') !== url){
			doc.querySelector('meta[name="og:title"]').setAttribute("content", title);
			doc.querySelector('meta[name="og:description"]').setAttribute("content", description);
			doc.querySelector('meta[name="og:url"]').setAttribute("content", url);
			doc.querySelector('meta[name="og:image"]').setAttribute("content", image);
		  fs.writeFile(indexName, doc.documentElement.outerHTML, function (err) {
		    if (err) return console.log(err);
		    next();
		  });
		}
		else{
			next();
		}
	});
}

function metaMiddleware(req, res, next){

	var updateStoryMeta = false;
	if(req.originalUrl.substring(0, 5) === '/view'){
		updateStoryMeta = true;
		var storyId = req.query.id;
	}

	if(updateStoryMeta){
		var sql = 'select hashtag, description, "imgKey", "thumbnailUrl" from storyView where id = '+storyId;
		db.query(sql).then(function(response){
			var story = response[0][0];
			var title = story.hashtag;
			var description = story.description;
			var url = 'http://hashtaghello.in'+req.originalUrl;
			var image = null;
			if(story.thumbnailUrl){
				image = story.thumbnailUrl;
			}
			else if(story.imgKey){
				image = getImgUrl(story.imgKey);
			}
			updateMeta(next, title, description, url, image);
		});
	}
	else{
		next();
	}
}

module.exports.metaMiddleware = metaMiddleware;