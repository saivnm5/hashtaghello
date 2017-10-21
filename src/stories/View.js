import React, { Component } from 'react';
import axios from 'axios';
import './view.css';
import { getImgUrl } from '../utils/aws';

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      storyId: props.match.params.id,
      hashtag: '',
      description: '',
      shots: [],
      activePart: 0
    }
  }

  componentWillMount = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($id: Int!) { \n story(id: $id) { \n hashtag \n description \n shots { \n imgKey \n } \n } \n }",
        variables: {
          id: this.state.storyId
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var story = response.data.data.story;
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            shots: story.shots
        });
    });
  }

  swipeLeft = () => {
    var currentActive = this.state.activePart;
    if(currentActive !== 0){
      this.setState({
        activePart: this.state.activePart - 1
      });
    }
  }

  swipeRight = () => {
    var currentActive = this.state.activePart;
    if(currentActive !== (this.state.shots.length-1)){
      this.setState({
        activePart: currentActive + 1
      });
    }
  }

  render() {
    var parts = [];
    for(var i=0; i<this.state.shots.length; i++){
      var activeClass = '';
      var imgUrl = getImgUrl(this.state.shots[i].imgKey, 'full');
      if(i == this.state.activePart){ activeClass = 'active'; }
      parts.push(<div className={"part "+activeClass} style={ { backgroundImage: 'url("'+imgUrl+'")' } }></div>)
    }
    return (
      <div className="container view-story" tabindex="1">
        <div className="header">
          <div>
            {this.state.hashtag}
          </div>
          <div className="right-align">
            <i className="fa fa-close"></i>
          </div>
        </div>
        <div className="navigation">
          <i className="fa fa-caret-left left" onClick={this.swipeLeft} ></i>
          <i className="fa fa-caret-right right" onClick={this.swipeRight} s></i>
        </div>
        <div className="body">
          {parts}
        </div>
      </div>
    );
  }
}

export default Home;
