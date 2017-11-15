import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logoImg from '../assets/img/logo.png';
import landingImg from '../assets/img/landing.png';
import './landing.css';

class Landing extends Component {

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

          <div className="landing-top">
            <div className="landing-top-img">
              <img src={landingImg} alt="hashtag hello - organise photos into stories" />
            </div>
            <div className="font-heading landing-tagline">
              our lives, as a story
            </div>
            <div className="font-heading">
              start creating with
            </div>
            <div className="font-heading">
              <span className="btn">
                <Link to="/profile?login=google">
                  google
                </Link>
              </span>
              &nbsp;&nbsp;or&nbsp;&nbsp;
              <span className="btn">
                <Link to="/profile?login=fb">
                  facebook
                </Link>
              </span>
            </div>
          </div>

          <div className="landing-features font-heading color-grey">
            <div>
              #multimedia - poems are just as important as films
            </div>
            <div className="divider">
              <hr className="bg-green" />
            </div>
            <div>
              #immersive - there are no likes, comments, followers etc. to bother about
            </div>
            <div className="divider">
              <hr className="bg-red" />
            </div>
            <div>
              #private - no one can message no one, nor view another's profile
            </div>
          </div>

          <div id="footer">
            <div className="font-sub-heading">
              what are you waiting for?
            </div>
            <div className="font-heading btn">
              <Link to="/profile">
                #LetsGetStarted
              </Link>
            </div>
          </div>

        </div>
    );
  }
}

export default Landing;