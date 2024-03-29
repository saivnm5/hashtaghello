/*global FB*/

import config from '../config';

var fbAppId = null;
if(config.DEBUG){
  fbAppId = config.fb_local_app_id;
}
else{
  fbAppId = config.fb_prod_app_id;
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : fbAppId,
    xfbml      : true,
    version    : 'v2.10'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


export function fbLogin(callbackObj){

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      callbackObj.success(response.userId);
    }
    else {
      FB.login(function(response) {
        if (response.status === 'connected') {
          callbackObj.success(response.userId);
        } else {
          alert('Login unsuccessful');
        }
      }, {scope: 'public_profile, email'});
    }
  });

}


export function getFbUserData(callbackObj){
  FB.api('/me', {fields: 'name,email'}, function(response) {
    callbackObj.success(response);
  });
}