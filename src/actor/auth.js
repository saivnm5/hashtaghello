var { graphql, buildSchema } = require('graphql');
var db = require('../db');

var schema = buildSchema(`
	input ActorInput{
    name: String!
    email: String
    fbUserId: String!
  }

  type Query {
  	test: String
  }

  type Mutation {
    getOrCreateActor(input: ActorInput): String
  }
`);

var root = {

	test: (data, request) => {
    return 'in auth api';
  },

	getOrCreateActor: (data) => {
    var input = data.input;
    var email = "null";
    if(input.email){ email = "'"+input.email+"'"; }

    var sql = "select * from getOrCreateActor('"+input.name+"',"+email+",'"+input.fbUserId+"')";
    return db.query(sql).then(function(response){
        return response[0][0].accesstoken;
    }).catch(function(error){
        console.log(error);
    });
  }

}

function authMiddleware(req, res, next) {
  var hardAuth = true;
	if(req.path === '/auth'){
		next();
	}
  else if(req.path === '/public'){
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

module.exports = {
  schema: schema,
  root: root,
  authMiddleware: authMiddleware
};