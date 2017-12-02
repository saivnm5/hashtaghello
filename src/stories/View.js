import React, { Component } from 'react';
import axios from 'axios';
import Swipeable from 'react-swipeable';
import ViewPart from './ViewPart';
import TheEnd from './TheEnd';
import { getImgUrl } from '../utils/simpl';
import {Helmet} from "react-helmet";
import onboardingGif from '../assets/img/view-nav-onboarding.gif';


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
      storyId: null,
      shots: [],
      activePart: 0,
      coverImg: null,
      navShowClass: 'hide',
      isPrivate: true,
      allowPayment: false,
      showOnboarding: false
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
    var currentPart = 0;
    if(localStorage.getItem(this.state.storySlug+'-currentPart') !== null){
      currentPart = parseInt(localStorage.getItem(this.state.storySlug+'-currentPart'), 10);
    }
    var data = {
        query: "query ($slug: String!) { \n story(slug: $slug) { \n id \n hashtag \n description \n createdByName \n slug \n imgKey \n thumbnailUrl \n isPrivate \n allowPayment \n parts { \n imgKey \n thumbnailUrl \n mediaUrl \n text \n  } \n } \n }",
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
        let activePart = 0;
        if(currentPart < story.parts.length){
          activePart = currentPart;
        }
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            createdByName: story.createdByName,
            slug: story.slug,
            shots: story.parts,
            storyId: story.id,
            activePart: activePart,
            coverImg: coverImg,
            isPrivate: story.isPrivate,
            allowPayment: story.allowPayment
        });
    });
  }

  componentDidUpdate() {
    var comp = this;
    document.addEventListener('keydown', this.keyboardNav);
    document.addEventListener('click', this.touchNav);
    document.addEventListener('mousemove', this.showArrows);

    var showOnboarding = false;
    if( localStorage.getItem('isTouchDevice') === "true" && localStorage.getItem('showSwipeLeftAnimation') === null){
      showOnboarding = true;
      localStorage.setItem('showSwipeLeftAnimation', "true");
    }
    if(showOnboarding){
      setTimeout(function(){
        comp.setState({
          showOnboarding: showOnboarding
        });
      }, 500);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyboardNav);
    document.removeEventListener('click', this.touchNav);
    document.removeEventListener('mousemove', this.showArrows);
  }

  touchNav = (event) => {
    var midpointX = window.innerWidth / 2;
    if(event.x < midpointX){
      this.showLeft();
    }
    else{
      this.showRight();
    }
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
    console.log('left');
    var currentActive = this.state.activePart;
    if(currentActive !== 0){
      this.setState({
        activePart: currentActive - 1,
        navShowClass: 'hide'
      });
      localStorage.setItem(this.state.storySlug+'-currentPart', currentActive-1);
    }
  }

  showRight = () => {
    console.log('right');
    var currentActive = this.state.activePart;
    if(currentActive !== (this.state.shots.length)){
      this.setState({
        activePart: currentActive + 1,
        navShowClass: 'hide'
      });
      localStorage.setItem(this.state.storySlug+'-currentPart', currentActive+1);
    }
  }

  render() {
    var parts = [];
    var activePart = this.state.activePart;
    var loadRangeMin = activePart - 1;
    var loadRangeMax = activePart + 3;
    if(this.state.shots.length > 0){
      var i = 0;
      for(; i<this.state.shots.length; i++){
        var activeClass = '';
        var load = false;
        if(i === activePart){ activeClass = 'active'; }
        if(i >= loadRangeMin && i <= loadRangeMax){
          load = true;
        }
        parts.push(<ViewPart data={this.state.shots[i]} activeClass={activeClass} key={i} load={load} />)
      }
      if(activePart === this.state.shots.length){ activeClass = 'active'; }
      else{ activeClass = ''; }
      parts.push(<TheEnd activeClass={activeClass} data={this.state} key={i+1} />);
    }

    var helmet = null;
    if(this.state.coverImg){
      helmet = (
        <Helmet>
          <title>{this.state.hashtag}</title>
        </Helmet>
      );
    }

    var onboardingClass = '';
    if(this.state.showOnboarding){
      onboardingClass = 'slow-fade'
    }
    var onboardingComp = (
      <div className={"view-nav-onboarding "+onboardingClass}>
        <img src={onboardingGif} alt="onboarding gif" />
      </div>
    );

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
        {onboardingComp}
        </div>
      </div>
      </div>
    );
  }
}

export default View;
