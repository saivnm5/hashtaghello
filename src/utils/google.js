/*global gapi*/

const googleClientId = '548479216000-iuq150q34kvrqdarm1tfi0katsm1ptgs.apps.googleusercontent.com';
const googleApiKey = 'AIzaSyDujDQRk4Zp-P3d_QDHYeG7b4_GBYuflYc';


function initClient() {
  gapi.client.init({
      apiKey: googleApiKey,
      discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
      clientId: googleClientId,
      scope: 'profile'
  }).then(function () {
    //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    //updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function makeApiCall(callbackObj) {
  // Make an API call to the People API, and print the user's given name.
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    'personFields': 'names,emailAddresses'
  }).then(function(response) {
    var userData = {};
    userData.name = response.result.names[0].displayName;
    userData.email = response.result.emailAddresses[0].value;
    userData.id = response.result.resourceName.split('/')[1];
    callbackObj.success(userData);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
}

export function googleLogin(callbackObj) {
  gapi.auth2.getAuthInstance().signIn().then(function(response){
    makeApiCall(callbackObj);
  });
}

// Loads the JavaScript client library and invokes `start` afterwards.
gapi.load('client:auth2', initClient);