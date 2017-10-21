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
import Home from './home/Index';
import View from './stories/View';


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
          <Route exact path="/" component={App} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/storyboard/:id" component={Create} />
          <Route exact path="/view/:id" component={View} />
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