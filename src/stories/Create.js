import React, { Component } from 'react';
import axios from 'axios';
import {uploadPhoto} from '../utils/aws';
import ChooseHashtag from './ChooseHashtag';
import StoryBoard from './StoryBoard';
import Publish from './Publish';
import { getRootDomain, getLines } from '../utils/simpl.js';
import { ToastContainer } from 'react-toastify';
import './create.css';
import { toast } from 'react-toastify';


const STAGES = [
  'HASHTAG',
  'STORYBOARD',
  'PUBLISH'
];

const defaultPart = {
  imgKey: null, mediaHTML: null, mediaUrl: null, isNew: true, text: null
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
        allowPayment: true,
        storyboardBtnText: 'Publish'
    };
    this.updatePart = this.updatePart.bind(this);
    this.removePart = this.removePart.bind(this);
  }

  loadData = (storySlug) => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($slug: String!) { \n story(slug: $slug) { \n id \n hashtag \n description \n isPrivate \n allowPayment \n slug \n parts { \n imgKey \n mediaUrl \n thumbnailUrl \n text \n } \n } \n }",
        variables: {
          slug: storySlug
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/get',
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
    var lines = getLines(event.target.value).length;
    if(event.target.value.length <= 100 && lines === 1){
      this.setState({
        description: event.target.value
      })
    }
  }

  createStory = () => {

    if(this.state.hashtag.length > 1){
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
    }
  }

  saveStory = () => {
    this.setState({
      storyboardBtnText: 'Saving...'
    });

    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var imgKeys = []; var soundcloudUrls = [];
    var youtubeUrls = []; var vimeoUrls = [];
    var texts = [];
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
      else if(part.text){
        string = order+___+part.text;
        texts.push(string);
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
            vimeoUrls: vimeoUrls,
            texts: texts
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
        comp.setState({
          storyboardBtnText: 'Publish'
        });

    }).catch(function(error){
      comp.setState({
        storyboardBtnText: 'Publish'
      });
      toast.warn("The update could not be saved. You may ignore this but, remember to publish before exiting.");
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

  isValidText = (text) => {
    const MAX_LINES = 14;
    const MAX_LENGTH = 560;
    return getLines(text).length <= MAX_LINES && text.length <= MAX_LENGTH ? true : false;
  }

  updatePart = (shotIndex, type, url, oembedData, text) => {
    var shotB = this.state.shots;
    var part = {};
    var isValid = true;

    if(type === 'image'){
      part = {
        imgKey: url,
        mediaUrl: null,
        mediaHTML: null,
        isNew: true
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
    else if(type === 'text'){
      isValid = this.isValidText(text);
      part = {
        imgKey: null, thumbnailUrl: null, mediaUrl: null, mediaHTML: null,
        text: text
      };
    }

    if(isValid){
      shotB[shotIndex] = part;
      this.setState({
        shots: shotB,
        uploadInProgress: false
      });
      this.saveStory();
    }
  }

  removePart = (shotIndex) => {
    var shotB = this.state.shots;
    shotB[shotIndex] = defaultPart;
    this.setState({
      shots: shotB
    });
  }

  goToNextEmptyPart = () => {
    var currentIndex = this.state.shotInFocus;
    var shots = this.state.shots;
    var newIndex = null;
    for(var i=currentIndex+1; i<shots.length; i++){
      if(shots[i].imgKey === null && shots[i].mediaUrl === null){
        newIndex = i;
        break;
      }
    }
    this.setState({
      shotInFocus: newIndex
    });
    return newIndex;
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

  manageImageUpload = (files, queueIndex, shotIndex, imgKey) => {

    var newShotIndex = this.state.shotInFocus;
    var totalImages = files.length;
    var file = files[queueIndex];
    // updating previous image if this is a multiple upload
    if(shotIndex !== undefined && imgKey !== undefined){
      this.updatePart(shotIndex, 'image', imgKey);
      newShotIndex = this.goToNextEmptyPart();
    }
    var callbackObj = {
      success: this.updatePart,
      shotIndex: newShotIndex,
      progress: this.uploadProgress,
      error: this.errorImageUpload
    };
    if(totalImages > queueIndex+1){
      callbackObj.nextIndex = queueIndex+1;
      callbackObj.nextImageUpload = this.manageImageUpload;
      callbackObj.files = files;
    }
    uploadPhoto(file, callbackObj);
    this.setState({
      uploadInProgress: true
    });
  }

  handleImageUpload = (event) => {
    if(event.target.files){
      this.manageImageUpload(event.target.files, 0);
    }
  }

  updateShots = (newShots, shotInFocus, proper) => {
    var newState = {};
    newState.shots = newShots;
    if(shotInFocus !== undefined){
      newState.shotInFocus = shotInFocus;
    }
    this.setState(newState);
    if(proper){
      this.saveStory();
    }
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
            multiple = "true"
          />
           <ToastContainer
            position="top-right"
            type="default"
            autoClose={6000}
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
