import React, { Component } from 'react';
import axios from 'axios';
import { getImgUrl } from '../utils/aws';
import Swipeable from 'react-swipeable';


class Home extends Component {

  constructor(props){
    super(props);

    var storyId = null;
    if(props.id){
      storyId = props.id;
    }
    else if(props.match.params.id){
      storyId = props.match.params.id;
    }

    this.state = {
      storyId: storyId,
      hashtag: '',
      description: '',
      shots: [],
      activePart: 0
    }
  }

  closeStory = () => {
    if(this.props.closeStory){
      this.props.closeStory();
    }
    else{
      window.document.location.href="/";
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

  showLeft = () => {
    var currentActive = this.state.activePart;
    if(currentActive !== 0){
      this.setState({
        activePart: this.state.activePart - 1
      });
    }
  }

  showRight = () => {
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
      if(i === this.state.activePart){ activeClass = 'active'; }
      parts.push(<div className={"part "+activeClass} style={ { backgroundImage: 'url("'+imgUrl+'")' } }></div>)
    }
    return (
      <div className="view-story-container">
      <div className="container view-story" tabIndex="1">
        <div className="header">
          <div>
            {this.state.hashtag}
          </div>
          <div className="right-align">
              <i className="fa fa-close" onClick={this.closeStory} ></i>
          </div>
        </div>
        <div className="navigation">
          <i className="fa fa-caret-left left" onClick={this.showLeft} ></i>
          <i className="fa fa-caret-right right" onClick={this.showRight} ></i>
        </div>
        <div className="body">
        <Swipeable
          onSwipingLeft={this.showRight}
          onSwipingRight={this.showLeft}
        >
          {parts}
        </Swipeable>
        </div>
      </div>
      </div>
    );
  }
}

export default Home;
