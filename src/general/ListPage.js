import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from './List';
import logoImg from '../assets/img/logo.png';


class ListPage extends Component {

  render() {
    return (
        <div className="container">

          <div id="header">
            <div className="header-image" >
              <img src={logoImg} alt="hashtag hello's logo" />
            </div>

            <div className="header-actions main">
              <div title="Your Stories" className="font-heading">
                <Link to="/create">
                  <i className="fa fa-plus"></i>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <List type={this.props.type} />
          </div>

          <div id="footer">
            <div className="font-sub-heading">
              that's all folks
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

export default ListPage;