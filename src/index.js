import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import App from './App';
import Create from './stories/Create';


class Routes extends React.Component{
  render() {
    return (
      <Router>
        <div className="pseudo-root">
          <Route exact path="/" component={App} />
          <Route exact path="/create" component={Create} />
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