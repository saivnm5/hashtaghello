import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from '../general/List';


class Profile extends Component {

  constructor(props){
    super(props);
    this.state = {
      hashtag: localStorage.getItem('actorHashtag')
    };
  }

  render() {
    return (
      <div className="container">
        <div id="header">
          <Link to="/">
          <div className="header-back">
            <i className="fa fa-arrow-left"></i>
          </div>
          </Link>
          <div className="header-title" >
              #{this.state.hashtag}
          </div>

          <div className="header-actions">
            <div title="Start telling a new story" className="font-heading">
              <Link to="/create">
                <i className="fa fa-plus"></i>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <List type="profile" />
        </div>
      </div>
    );
  }
}

export default Profile;
