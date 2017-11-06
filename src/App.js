import React, { Component } from 'react';
import Home from './stories/Home';
import Landing from './general/Landing';

class App extends Component {

  render() {
    if(localStorage.getItem('isLoggedIn') === "true"){
      return ( <Home /> );
    }
    else{
      return ( <Landing /> );
    }
  }
}

export default App;
