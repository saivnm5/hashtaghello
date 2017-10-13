import React, { Component } from 'react';
import List from './general/List';
import './App.css';
import config from './config';
import logoImg from './assets/logo.png';

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
            <div className="header-image">
              <img src={logoImg} />
            </div>

            <div className="header-actions">
              <div title="Your Stories" className="font-heading">#i</div>
            </div>
          </div>

          <div id="body">
            <List />
          </div>

          <div id="footer">
            <div className="font-sub-heading">
              we publish a monthly newsletter
            </div>
            <div className="font-heading"><a href="https://hashhello.typeform.com/to/lrL7KZ"><u>#StayInTouch</u></a></div>
          </div>

        </div>
    );
  }
}

export default App;
