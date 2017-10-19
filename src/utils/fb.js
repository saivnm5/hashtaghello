/*global FB*/

window.fbAsyncInit = function() {
  FB.init({
    //appId      : '380187239085835',
    appId      : '1961070890815728',
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
      localStorage.setItem('isLoggedIn', true);
      callbackObj.success(response.userId);
    }
    else {
      FB.login(function(response) {
        if (response.status === 'connected') {
          localStorage.setItem('isLoggedIn', "true");
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