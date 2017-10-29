import React, { Component } from 'react';
import axios from 'axios';
import {uploadPhoto} from '../utils/aws';
import ChooseHashtag from './ChooseHashtag';
import StoryBoard from './StoryBoard';
import Publish from './Publish';
import { getRootDomain } from '../utils/simpl.js';
import { ToastContainer } from 'react-toastify';
import './create.css';

const STAGES = [
  'HASHTAG',
  'STORYBOARD',
  'PUBLISH'
];

const defaultPart = {
  imgKey: null, mediaHTML: null, mediaUrl: null
};

class Create extends Component {

  constructor(props){
    super(props);
    var storySlug = null;
    var shots = [];
    if(props.location.hash){
      storySlug = props.location.hash;
      this.loadData(storySlug);
    }
    for(var i=0; i<100; i++){
      shots.push(defaultPart);
    }

    this.state = {
        hashtag: '#',
        description: '',
        stage: STAGES[0],
        story: null,
        shots: shots,
        shotInFocus: 0,
        uploadInProgress: false,
        uploadPercentage: 0,
        isPrivate: true,
        allowPayment: true
    };
    this.updatePart = this.updatePart.bind(this);
  }

  loadData = (storySlug) => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($slug: String!) { \n story(slug: $slug) { \n id \n hashtag \n description \n isPrivate \n allowPayment \n slug \n parts { \n imgKey \n mediaUrl \n thumbnailUrl \n } \n } \n }",
        variables: {
          slug: storySlug
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/public',
      data: data
    }).then(function(response){
        var story = response.data.data.story;
        var shots = story.parts;
        var newShots = shots.concat(comp.state.shots);
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            isPrivate: story.isPrivate,
            allowPayment: story.allowPayment,
            shots: newShots,
            story: story.id
        });
    });
  }

  changeStage = (stage) => {
    this.setState({
      stage: STAGES[stage]
    });
  }

  handleTagChange = (event) => {
    var hashtag = event.target.value;

    if(hashtag && hashtag.length <= 31 && hashtag[0] === '#'){
      var hashlessTag = hashtag.replace(/^#/, '');
      if(hashlessTag.match(/^[a-z0-9]+$/i) || !hashlessTag){
        this.setState({
          hashtag: hashtag
        });
      }
    }
  }

  handleDescriptionChange = (event) => {
    var numberOfLineBreaks = (event.target.value.match(/\n/g)||[]).length;
    if(event.target.value.length <= 100 && numberOfLineBreaks === 0){
      this.setState({
        description: event.target.value
      })
    }
  }

  createStory = () => {

    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    let headers = { "Authorization" : localStorage.getItem("authToken") };
    var data = {
        query: "mutation createOrUpdateStory($input: StoryInput) { \n createOrUpdateStory(input: $input) \n }",
        variables: {
          input:{
            hashtag: comp.state.hashtag,
            description: comp.state.description,
            id: comp.state.story
          }
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      headers: headers,
      data: data
    }).then(function(response){
        var data = response.data.data;
        comp.setState({
            story: data.createOrUpdateStory
        });
    });

    this.setState({
      stage: STAGES[1]
    });
    //this.triggerUpload();
  }

  saveStory = () => {
    var apiRoot = localStorage.getItem('apiRoot');
    var imgKeys = []; var soundcloudUrls = [];
    var youtubeUrls = []; var vimeoUrls = [];
    var ___ = '###'; // delimiter
    var order = 0;
    for(var i=0; i < this.state.shots.length; i++){
      var part = this.state.shots[i];
      var string = '';
      if(part.mediaUrl){
        var domain = getRootDomain(part.mediaUrl);
        string = order+___+part.mediaUrl+___+part.thumbnailUrl;
        order++;
        if(domain === 'soundcloud.com'){
          soundcloudUrls.push(string);
        }
        else if(domain === 'youtube.com'){
          youtubeUrls.push(string);
        }
        else if(domain === 'vimeo.com'){
          vimeoUrls.push(string);
        }
      }
      else if(part.imgKey){
        string = order+___+part.imgKey;
        imgKeys.push(string);
        order++;
      }
    }
    var data = {
        query: "mutation saveStory($input: PartInput) { \n saveStory(input: $input) \n }",
        variables: {
          input:{
            story: this.state.story,
            imgKeys: imgKeys,
            soundcloudUrls: soundcloudUrls,
            youtubeUrls: youtubeUrls,
            vimeoUrls: vimeoUrls
          }
        }
    };
    let headers = { "Authorization" : localStorage.getItem("authToken") };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data,
      headers: headers
    }).then(function(response){
        var data = response.data.data;
        if(data.saveStory === 1){
          console.log('Story saved');
        }
    });
  }

  triggerUpload = () => {
    this.imageInput.click();
  }

  updateShotInFocus = (newShotIndex) => {
    this.setState({
      shotInFocus: newShotIndex
    });
  }

  updatePart = (shotIndex, type, url, oembedData) => {
    var shotB = this.state.shots;
    var part = {};

    if(type === 'image'){
      part = {
        imgKey: url,
        mediaUrl: null,
        mediaHTML: null
      };
    }
    else if(type === 'audio' || type === 'video' || type === 'media'){
      part = {
        imgKey: null,
        thumbnailUrl: oembedData.thumbnail_url,
        mediaUrl: url,
        mediaHTML: oembedData.html
      };
    }
    shotB[shotIndex] = part;

    this.setState({
      shots: shotB,
      uploadInProgress: false
    });
    this.saveStory();
  }

  removePart = (shotIndex) => {
    var shotB = this.state.shots;
    shotB[shotIndex] = defaultPart;
    this.setState({
      shots: shotB
    });
  }

  uploadProgress = (percentage) => {
    this.setState({
      uploadPercentage: percentage
    });
  }

  errorImageUpload = () => {
    this.setState({
      uploadInProgress: false
    });
  }

  handleImageUpload = (event) => {
    var callbackObj = {
      success: this.updatePart,
      shotIndex: this.state.shotInFocus,
      progress: this.uploadProgress,
      error: this.errorImageUpload
    };
    uploadPhoto(event.target.files, callbackObj);
    this.setState({
      uploadInProgress: true
    });
  }

  updateShots = (newShots, shotInFocus) => {
    var newState = {};
    newState.shots = newShots;
    if(shotInFocus !== undefined){
      newState.shotInFocus = shotInFocus;
    }
    this.setState(newState);
  }

  render() {
    var currentStage = null;
    if (this.state.stage === STAGES[0]){
      currentStage = <ChooseHashtag
                    handleTagChange = {this.handleTagChange}
                    handleDescriptionChange = {this.handleDescriptionChange}
                    handleImageUpload = {this.handleImageUpload}
                    createStory = {this.createStory}
                    data = {this.state}
                  />;
    }
    else if (this.state.stage === STAGES[1]){
      currentStage = <StoryBoard
                    handleTagChange = {this.handleTagChange}
                    handleDescriptionChange = {this.handleDescriptionChange}
                    handleImageUpload = {this.handleImageUpload}
                    saveStory = {this.saveStory}
                    updateShots = {this.updateShots}
                    updateShotInFocus = {this.updateShotInFocus}
                    triggerUpload = {this.triggerUpload}
                    updateShotPhoto = {this.updateShotPhoto}
                    changeStage = {this.changeStage}
                    updatePart = {this.updatePart}
                    removePart = {this.removePart}
                    data = {this.state}
                  />;
    }
    else if (this.state.stage === STAGES[2]){
      currentStage = <Publish
                    changeStage = {this.changeStage}
                    data = {this.state}
                  />;
    }

      return(
        <div className="container">
          {currentStage}
          <input
            type="file"
            accept="image/*"
            ref={(input) => { this.imageInput = input; }}
            style={{display:'none'}}
            onChange = {this.handleImageUpload}
          />
           <ToastContainer
            position="top-right"
            type="default"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        </div>
      );
  }
}

export default Create;
