import React, { Component } from 'react';
import Profile from './Profile';
import Login from './Login';
import axios from 'axios';


class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentWillMount(){
    var apiRoot = localStorage.getItem('apiRoot');
    var comp = this;

    if(localStorage.getItem('isLoggedIn') === "true" && localStorage.getItem('authToken') !== null && localStorage.getItem('actorName') !== null){

      var data = {
        query: "query { \n whoami \n }",
      }
      let headers = { "Authorization" : localStorage.getItem("authToken") };
      axios({
        method: 'post',
        url: apiRoot+'/auth',
        data: data,
        headers: headers
      }).then(function(response){
          var data = response.data.data;
          var hashtag = data.whoami;
          if(hashtag){
            localStorage.setItem('actorHashtag', hashtag);
            comp.setState({
              isLoggedIn: true
            });
          }
          else{
            localStorage.removeItem('authToken');
          }
      });
    }
  }

  render() {
    if(this.state.isLoggedIn){
      return( <Profile /> );
    }
    else{
      return( <Login /> );
    }
  }
}

export default Index;
