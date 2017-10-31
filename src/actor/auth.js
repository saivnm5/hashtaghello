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
  if(req.path === '/public' || req.path === '/api'){
    if(req.path === '/public'){
      hardAuth = false;
    }
    var authToken = req.header('Authorization');
    var sql = "select * from getActor('"+authToken+"')";
    db.query(sql).then(function(response){
      console.log(response[0]);
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

function isAuthorized(table, actor, objectId){
  var sql = null;
  if(objectId){
    sql = "select count(*) from \""+table+"\" where \"createdBy\" = "+actor+" and \"id\" = "+objectId;
  }
  else{
      sql = "select count(*) from \"actor\" where \"id\" = "+actor;
  }

  const isAllowed = new Promise((resolve, reject) => {

    db.query(sql).then(function(results){
      console.log('Authorization | '+results[0][0].count+' | '+sql);
      if(results[0][0].count == 1){
        resolve(true);
      }
      else{
        console.log('inside reject');
        reject(true);
      }
    })
    .catch(function(error){
      reject(true);
    });

  });
  return isAllowed;
}

module.exports = {
  schema: schema,
  root: root,
  authMiddleware: authMiddleware,
  isAuthorized: isAuthorized
};