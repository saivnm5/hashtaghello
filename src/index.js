import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import config from './config';
import Create from './stories/Create';
import Profile from './actor/Index';
import View from './stories/View';
import Public from './stories/Public';
import Feed from './stories/Feed';
import {Helmet} from "react-helmet";
import { isTouchDevice } from './utils/simpl';
import './general/forms.css';
import './app/app.css';
import './stories/story.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './assets/ReactToastify.min.css';


class Routes extends React.Component{
  componentWillMount(){
    if(config.DEBUG){
      localStorage.setItem('apiRoot', config.localApiRoot);
    }
    else{
      localStorage.setItem('apiRoot', config.apiRoot);
    }

    if(isTouchDevice()){
      localStorage.setItem('isTouchDevice', "true");
    }
    else{
      localStorage.setItem('isTouchDevice', "false");
    }
  }
  render() {
    return (
      <Router>
        <div className="pseudo-root">
          <Helmet>
            <title>#hello - stories of the people, by the people, for the people</title>
          </Helmet>
          <Route exact path="/" component={Public} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/storyboard/" component={Create} />
          <Route exact path="/view" component={View} />
          <Route exact path="/public" component={Public} />
          <Route exact path="/feed" component={Feed} />
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