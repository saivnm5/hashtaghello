import React, { Component } from 'react';
import Landing from '../general/Landing';
import Profile from '../actor/Index';

class App extends Component {

  render() {
    if(localStorage.getItem('isLoggedIn') === "true"){
      return ( <Profile location={this.props.location} /> );
    }
    else{
      return ( <Landing /> );
    }
  }
}

export default App;