import React, { Component } from 'react';
import Landing from '../general/Landing';
import Featured from '../stories/Featured';

class App extends Component {

  render() {
    if(localStorage.getItem('isLoggedIn') === "true"){
      return ( <Featured /> );
    }
    else{
      return ( <Landing /> );
    }
  }
}

export default App;
