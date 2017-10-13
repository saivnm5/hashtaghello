import React, { Component } from 'react';
import List from './general/List';
import './App.css';
import config from './config';

class App extends Component {

  componentWillMount(){
    if(config.DEBUG){
      localStorage.setItem('apiRoot', config.localApiRoot);
    }
    else{
      localStorage.setItem('apiRoot', config.apiRoot);
    }
  }

  handleTestEvent = () => {
    window.ga('send', 'event', {
        eventCategory: 'Test',
        eventAction: 'click',
        eventLabel: 'heading'
    });
  }

  render() {
    return (
        <div className="app-container">

          <div id="header">
            <div className="font-x-large" onClick={()=> this.handleTestEvent()}>#Greet</div>
          </div>

          <div id="body">
            <List />
          </div>

          <div id="footer">
            <div className="font-sub-heading">
              we publish a monthly calendar
            </div>
            <div className="font-heading"><a href="https://hashhello.typeform.com/to/lrL7KZ"><u>#StayInTouch</u></a></div>
          </div>

        </div>
    );
  }
}

export default App;
