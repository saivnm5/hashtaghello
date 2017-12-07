import React, { Component } from 'react';
import Landing from '../general/Landing';
import Public from '../stories/Public';

class App extends Component {

  render() {
    if(localStorage.getItem('isLoggedIn') === "true"){
      return ( <Public /> );
    }
    else{
      return ( <Landing /> );
    }
  }
}

export default App;
