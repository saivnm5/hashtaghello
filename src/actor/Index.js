import React, { Component } from 'react';
import Profile from './Profile';
import Login from './Login';


class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentWillMount(){
    if(localStorage.getItem('isLoggedIn') === "true" && localStorage.getItem('authToken') !== null && localStorage.getItem('actorName') !== null){
      this.setState({
        isLoggedIn: true
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
