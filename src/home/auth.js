import axios from 'axios';
import { getFbUserData } from '../utils/fb';

export function getActor(fbUserId) {
  var callbackObj = { success: getOrCreateActor };
  getFbUserData(callbackObj);
}

function getOrCreateActor(userData) {
	var apiRoot = localStorage.getItem('apiRoot');
	var email = null;
	if(userData.email !== undefined){ email = userData.email; }

  var data = {
      query: "mutation getOrCreateActor($input: ActorInput) { \n getOrCreateActor(input: $input) \n }",
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
      if(data.getOrCreateActor){
      	localStorage.setItem('authToken', userData.id);
        localStorage.setItem('actorName', userData.name);
        localStorage.setItem('isLoggedIn', true);
        window.location.reload();
        console.log('Logged in');
      }
  });
}