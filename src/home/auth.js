import axios from 'axios';
import { getFbUserData } from '../utils/fb';

export function verifyActor(fbUserId) {
  // call api and check if this user exists
  // if yes
    //localStorage.setItem('authToken', fbUserId);
  // else
  var callbackObj = { success: createActor };
  getFbUserData(callbackObj);
}

function createActor(userData) {
	console.log('Creating Actor');
	var apiRoot = localStorage.getItem('apiRoot');
	var email = null;
	if(userData.email !== undefined){ email = userData.email; }

  var data = {
      query: "mutation createActor($input: ActorInput) { \n createActor(input: $input) \n }",
      variables: {
        input:{
          name: userData.name,
          email: email,
          fbUserId: userData.id
        }
      }
  }

  axios({
    method: 'post',
    url: apiRoot+'/api',
    data: data
  }).then(function(response){
      var data = response.data.data;
      if(data.createActor){
      	localStorage.setItem('authToken', userData.id)
      }
  });
}