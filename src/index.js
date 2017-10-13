import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import App from './App';


class Routes extends React.Component{
  render() {
    return (
      <Router>
          <Route exact path="/" component={() => (<App type="events" />)} />
      </Router>
    );
  }
}

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);

registerServiceWorker();