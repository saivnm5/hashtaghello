var { graphql, buildSchema } = require('graphql');
var db = require('../db');

var schema = buildSchema(`
	input ActorInput{
    name: String!
    email: String
    fbUserId: String!
  }

  type Query {
  	whoami: String
  }

  type Mutation {
    getOrCreateActor(input: ActorInput): String
  }
`);

var root = {

	whoami: (data, request) => {
    var authToken = request.get('Authorization');
    var sql = "select currenthashtag from getActor('"+authToken+"')";
    console.log(sql);
    return db.query(sql).then(function(results){
      if(results[0][0].currenthashtag){
        return results[0][0].currenthashtag;
      }
    }).
    catch(function(error){
      console.log(error);
    });
  },

	getOrCreateActor: (data) => {
    var input = data.input;
    var email = "null";
    if(input.email){ email = "'"+input.email+"'"; }
    var hashtag = input.name.replace(/ /g,'');

    var sql = "select * from getOrCreateActor('"+input.name+"',"+email+",'"+input.fbUserId+"', '"+hashtag+"')";
    return db.query(sql).then(function(response){
        return response[0][0].accesstoken;
    }).catch(function(error){
        console.log(error);
    });
  }

}

function authMiddleware(req, res, next) {
  var hardAuth = true;

  if(req.path === '/public' || req.path === 'api'){
    if(req.path === '/public'){
      hardAuth = false;
    }
    var authToken = req.get('Authorization');
    var sql = "select * from getActor('"+authToken+"')";
    db.query(sql).then(function(response){
        if(response[0][0].actorid){
          req.actor = response[0][0].actorid;
          next();
        }
        else{
          if(hardAuth){
           res.status(401).send('Bad Access Token');
          }
          else{
            next();
          }
        }
    });
  }
	else{
		next();
	}
}

module.exports = {
  schema: schema,
  root: root,
  authMiddleware: authMiddleware
};