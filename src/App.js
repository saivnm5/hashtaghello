import React, { Component } from 'react';
import List from './general/List';
import './assets/forms.css';
import './App.css';
import './stories/story.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './assets/ReactToastify.min.css';
import logoImg from './assets/logo.png';
import { Link } from 'react-router-dom';

class App extends Component {

  render() {
    return (
        <div className="container">

          <div id="header">
            <div className="header-image" >
              <img src={logoImg} alt="hashtag hello's logo" />
            </div>

            <div className="header-actions main">
              <div title="Your Stories" className="font-heading">
                <Link to="/profile">
                  <i className="fa fa-hashtag"></i>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <List type="home" />
          </div>

          <div id="footer">
            <div className="font-sub-heading">
              that's all folks, but if you want you can
            </div>
            <div className="font-heading btn">
              <Link to="/profile">
                #WriteYourOwnStory
              </Link>
            </div>
          </div>

        </div>
    );
  }
}

export default App;
