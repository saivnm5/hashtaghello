import React, { Component } from 'react';
import axios from 'axios';
import Swipeable from 'react-swipeable';
import ViewPart from './ViewPart';
import TheEnd from './TheEnd';
import { getImgUrl } from '../utils/aws';


class View extends Component {

  constructor(props){
    super(props);

    var storySlug = null;
    if(props.slug){
      storySlug = props.slug;
    }
    else if(props.location.hash){
      storySlug = props.location.hash
    }

    this.state = {
      storySlug: storySlug,
      hashtag: '',
      description: '',
      createdByName: '',
      slug: '',
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
        query: "query ($slug: String!) { \n story(slug: $slug) { \n hashtag \n description \n createdByName \n slug \n imgKey \n thumbnailUrl \n parts { \n imgKey \n thumbnailUrl \n mediaUrl \n  } \n } \n }",
        variables: {
          slug: this.state.storySlug
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/public',
      data: data
    }).then(function(response){
        var story = response.data.data.story;
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            createdByName: story.createdByName,
            slug: story.slug,
            shots: story.parts,
            activePart: 0
        });
        // set meta data
        var coverImg= null;
        if(story.imgKey){
            coverImg = getImgUrl(story.imgKey);
        }
        else if(story.thumbnailUrl){
            coverImg = story.thumbnailUrl;
        }
        document.querySelector('meta[property="og:title"]').setAttribute("content", '#'+story.hashtag);
        document.querySelector('meta[property="og:description"]').setAttribute("content", story.description);
        document.querySelector('meta[property="og:image"]').setAttribute("content", coverImg);
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
    if(currentActive !== (this.state.shots.length)){
      this.setState({
        activePart: currentActive + 1
      });
    }
  }

  render() {
    var parts = [];
    if(this.state.shots.length > 0){
      var i = 0;
      for(; i<this.state.shots.length; i++){
        var activeClass = '';
        if(i === this.state.activePart){ activeClass = 'active'; }
        parts.push(<ViewPart data={this.state.shots[i]} activeClass={activeClass} key={i} />)
      }
      if(this.state.activePart === this.state.shots.length){ activeClass = 'active'; }
      else{ activeClass = ''; }
      parts.push(<TheEnd activeClass={activeClass} data={this.state} key={i+1} />);
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
          onSwipedLeft={this.showRight}
          onSwipedRight={this.showLeft}
        >
          {parts}
        </Swipeable>
        </div>
      </div>
      </div>
    );
  }
}

export default View;
