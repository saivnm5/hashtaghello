import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import config from './config';

import App from './App';
import Create from './stories/Create';
import Profile from './actor/Index';
import View from './stories/View';
import {Helmet} from "react-helmet";


class Routes extends React.Component{
  componentWillMount(){
    if(config.DEBUG){
      localStorage.setItem('apiRoot', config.localApiRoot);
    }
    else{
      localStorage.setItem('apiRoot', config.apiRoot);
    }
  }
  render() {
    return (
      <Router>
        <div className="pseudo-root">
        <Helmet>
          <title>#hello - a space for the stories of the world</title>
        </Helmet>
          <Route exact path="/" component={App} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/storyboard/" component={Create} />
          <Route exact path="/view/" component={View} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);

registerServiceWorker();