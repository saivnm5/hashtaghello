import React, { Component } from 'react';
import Home from './Home';
import Login from './Login';


class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentWillMount(){
    if(localStorage.getItem('isLoggedIn') === "true" && localStorage.getItem('authToken') !== null){
      this.setState({
        isLoggedIn: true
      });
    }
  }

  render() {
    if(this.state.isLoggedIn){
      return( <Home /> );
    }
    else{
      return( <Login /> );
    }
  }
}

export default Index;
