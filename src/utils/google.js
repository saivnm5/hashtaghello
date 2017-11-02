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
    gapi.auth2.getAuthInstance().isSignedIn.listen(justChecking);
    justChecking(gapi.auth2.getAuthInstance().isSignedIn.get());
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
    if(callbackObj){
      callbackObj.success(userData);
    }
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
}

function justChecking(isSignedIn, callbackObj) {
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  if (isSignedIn) {
    makeApiCall(callbackObj);
  }
}

function updateSigninStatus(isSignedIn, callbackObj) {
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  if (isSignedIn) {
    makeApiCall(callbackObj);
  }
}

export function googleLogin(callbackObj) {
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get(), callbackObj);
  gapi.auth2.getAuthInstance().signIn();
}

// Loads the JavaScript client library and invokes `start` afterwards.
gapi.load('client:auth2', initClient);