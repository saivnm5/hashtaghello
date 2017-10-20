import React, { Component } from 'react';
import { fbLogin } from '../utils/fb';
import { getActor } from './auth';


class Home extends Component {

  componentWillMount(){
    this.login();
  }

  login = () => {
    var comp = this;
    var callbackObj = { success: getActor };
    if (typeof window.FB !== 'undefined') {
      fbLogin(callbackObj);
    }
    else{
      setTimeout(function(){
        comp.login();
      }, 200);
    }
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

export default Home;
