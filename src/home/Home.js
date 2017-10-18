import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from '../general/List';
import { fbLogin } from '../utils/fb';
import { verifyActor } from './auth';


class Home extends Component {

  componentWillMount(){
    this.login();
  }

  login = () => {
    if(localStorage.getItem('isLoggedIn') !== "true" || localStorage.getItem('authToken') === null){
      var comp = this;
      var callbackObj = {
        success: verifyActor
      }
      if (typeof window.FB !== 'undefined') {
        console.log('Calling FB login');
        fbLogin(callbackObj);
      }
      else{
        setTimeout(function(){
          comp.login();
        }, 200);
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div id="header">
          <Link to="/">
          <div className="header-back">
            <i className="fa fa-arrow-left"></i>
          </div>
          </Link>
          <div className="header-title" >
              #home
          </div>

          <div className="header-actions">
            <div title="Start telling a new story" className="font-heading">
              <Link to="/create">
                <i className="fa fa-plus"></i>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <List type="home" />
        </div>
      </div>
    );
  }
}

export default Home;
