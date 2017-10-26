import React, { Component } from 'react';
import axios from 'axios';
import { fbLogin, getFbUserData } from '../utils/fb';


class Login extends Component {

  componentWillMount(){
    this.login();
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
            fbUserId: userData.id
          }
        }
    }

    axios({
      method: 'post',
      url: apiRoot+'/auth',
      data: data
    }).then(function(response){
        var data = response.data.data;
        if(data.getOrCreateActor){
          localStorage.setItem('authToken', userData.id);
          localStorage.setItem('actorName', userData.name);
          localStorage.setItem('isLoggedIn', true);
          window.location.reload();
        }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="login-body">
          <div className="font-heading">
            Login using &nbsp;<span className="btn" onClick={this.login}>Facebook</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
