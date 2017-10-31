import React, { Component } from 'react';
import axios from 'axios';
import Swipeable from 'react-swipeable';
import ViewPart from './ViewPart';
import TheEnd from './TheEnd';
import { getImgUrl } from '../utils/aws';
import {Helmet} from "react-helmet";


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
      activePart: 0,
      coverImg: null,
      navShowClass: 'hide'
    };
    this.showArrows = this.showArrows.bind(this);
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
    var startingPart = 0;
    if(localStorage.getItem(this.state.storySlug+'-currentPart') !== null){
      startingPart = parseInt(localStorage.getItem(this.state.storySlug+'-currentPart'), 10);
    }
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
        var coverImg= null;
        if(story.imgKey){
            coverImg = getImgUrl(story.imgKey);
        }
        else if(story.thumbnailUrl){
            coverImg = story.thumbnailUrl;
        }
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            createdByName: story.createdByName,
            slug: story.slug,
            shots: story.parts,
            activePart: startingPart,
            coverImg: coverImg
        });
    });
  }

  componentDidUpdate() {
    document.addEventListener('keydown', this.keyboardNav);
    document.addEventListener('mousemove', this.showArrows);
  }

  keyboardNav = (event) => {
    if(event.key === "ArrowRight"){
      this.showRight();
    }
    else if(event.key === "ArrowLeft"){
      this.showLeft();
    }
  }

  showArrows = () => {
    if(this.state.navShowClass === 'hide'){
      this.setState({
        navShowClass: 'show'
      });
    }
  }

  showLeft = () => {
    var currentActive = this.state.activePart;
    if(currentActive !== 0){
      this.setState({
        activePart: currentActive - 1,
        navShowClass: 'hide'
      });
    }
    localStorage.setItem(this.state.storySlug+'-currentPart', currentActive-1);
  }

  showRight = () => {
    var currentActive = this.state.activePart;
    if(currentActive !== (this.state.shots.length)){
      this.setState({
        activePart: currentActive + 1,
        navShowClass: 'hide'
      });
    }
    localStorage.setItem(this.state.storySlug+'-currentPart', currentActive+1);
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

    var helmet = null;
    if(this.state.coverImg){
      helmet = (
        <Helmet>
          <meta property="og:url" content={"http://hashtaghello.in/view/"+this.state.slug} />
          <meta property="og:title" content={this.state.hashtag} />
          <meta property="og:description" content={this.state.description} />
          <meta property="og:image" content={this.state.coverImg} />
          <title>{this.state.hashtag}</title>
        </Helmet>
      );
    }

    return (
      <div className="view-story-container">
      {helmet}
      <div className="container view-story" tabIndex="1">
        <div className="header">
          <div>
            {this.state.hashtag}
          </div>
          <div className="right-align">
              <i className="fa fa-close" onClick={this.closeStory} ></i>
          </div>
        </div>
        <div className={"navigation "+this.state.navShowClass} >
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
