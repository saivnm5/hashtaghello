import React, { Component } from 'react';
import axios from 'axios';
import { fbLogin, getFbUserData } from '../utils/fb';
import { googleLogin } from '../utils/google';

class Login extends Component {

  componentWillMount(){
    //this.login();
  }

  login = () => {
    var comp = this;
    var callbackObj = { success: this.getActor };
    if (typeof window.FB !== 'undefined') {
      fbLogin(callbackObj);
    }
    else{
      setTimeout(function(){
        comp.login();
      }, 200);
    }
  }

  getActor = (fbUserId) => {
    var callbackObj = { success: this.getOrCreateActor };
    getFbUserData(callbackObj);
  }

  getOrCreateActor = (userData) => {
    var apiRoot = localStorage.getItem('apiRoot');
    var email = null;
    if(userData.email !== undefined){ email = userData.email; }

    var data = {
        query: "mutation getOrCreateActor($input: ActorInput) { \n getOrCreateActor(input: $input) \n }",
        variables: {
          input:{
            name: userData.name,
            email: email,
            fbUserId: userData.id,
            googleUserId: null
          }
        }
    }

    axios({
      method: 'post',
      url: apiRoot+'/auth',
      data: data
    }).then(function(response){
        var data = response.data.data;
        var accessToken = data.getOrCreateActor;
        if(accessToken){
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('actorName', userData.name);
          localStorage.setItem('isLoggedIn', true);
          window.location.reload();
        }
    });
  }

  getOrCreateActorGoogle = (userData) => {
    var apiRoot = localStorage.getItem('apiRoot');

    var data = {
        query: "mutation getOrCreateActor($input: ActorInput) { \n getOrCreateActor(input: $input) \n }",
        variables: {
          input:{
            name: userData.name,
            email: userData.email,
            googleUserId: userData.id,
            fbUserId: null
          }
        }
    }

    axios({
      method: 'post',
      url: apiRoot+'/auth',
      data: data
    }).then(function(response){
        var data = response.data.data;
        var accessToken = data.getOrCreateActor;
        if(accessToken){
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('actorName', userData.name);
          localStorage.setItem('isLoggedIn', true);
          window.location.reload();
        }
    });
  }

  gLogin = () => {
    var callbackObj = { success: this.getOrCreateActorGoogle };
    var comp = this;
    if (typeof window.gapi.client !== 'undefined') {
      googleLogin(callbackObj);
    }
    else{
      setTimeout(function(){
        comp.gLogin();
      }, 200);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="login-body font-heading">
          <div>
            Login using &nbsp;
          </div>
          <div>
            <span className="btn" onClick={this.login}>Facebook</span> &nbsp;
            or &nbsp;
            <span className="btn" onClick={this.gLogin}>Google</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
