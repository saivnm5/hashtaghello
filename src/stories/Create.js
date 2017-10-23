import React, { Component } from 'react';
import axios from 'axios';
import {uploadPhoto} from '../utils/aws';
import ChooseHashtag from './ChooseHashtag';
import StoryBoard from './StoryBoard';
import './create.css';

const STAGES = [
  'HASHTAG',
  'STORYBOARD',
  'PUBLISH'
];


class Create extends Component {

  constructor(props){
    super(props);
    var storyId = null;
    var shots = [];
    if(props.match.params.id){
      storyId = props.match.params.id;
      this.loadData(storyId);
    }
    for(var i=0; i<100; i++){
      shots.push({imgKey: null, originalOrder: i});
    }

    this.state = {
        hashtag: '#',
        description: '',
        stage: STAGES[1],
        story: storyId,
        shots: shots,
        shotInFocus: 0,
        uploadInProgress: false,
        uploadPercentage: 0
    };
  }

  loadData = (storyId) => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($id: Int!) { \n story(id: $id) { \n hashtag \n description \n shots { \n imgKey \n } \n } \n }",
        variables: {
          id: storyId
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var story = response.data.data.story;
        var shots = story.shots;
        var newShots = shots.concat(comp.state.shots);
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            shots: newShots,
            story: storyId
        });
    });
  }

  changeStage = (stage) => {
    this.setState({
      stage: STAGES[stage]
    });
  }

  handleTagChange = (event) => {
    if(event.target.value && event.target.value.length <= 30){
      this.setState({
        hashtag: event.target.value
      });
    }
  }

  handleDescriptionChange = (event) => {
    if(event.target.value.length <= 100){
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
    var shots = [];
    for(var i=0; i < this.state.shots.length; i++){
      var imgKey = this.state.shots[i].imgKey;
      if(imgKey){
        shots.push(imgKey);
      }
    }
    var data = {
        query: "mutation saveStory($input: PartInput) { \n saveStory(input: $input) \n }",
        variables: {
          input:{
            story: this.state.story,
            shots: shots
          }
        }
    }

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var data = response.data.data;
        if(data.saveStory === 1){
          alert('Story saved successfully!');
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

  updateMediaPart = (shotIndex, url, thumbnailUrl) => {
    var shotB = this.state.shots;
    shotB[shotIndex].imgKey = thumbnailUrl;
    shotB[shotIndex].url = url;
    this.setState({
      shots: shotB
    });
  }

  updateShotPhoto = (imgKey, shotIndex) => {
    var shotB = this.state.shots;
    shotB[shotIndex].imgKey = imgKey;
    this.setState({
      shots: shotB,
      uploadInProgress: false
    });
  }

  uploadProgress = (percentage) => {
    this.setState({
      uploadPercentage: percentage
    });
  }

  handleImageUpload = (event) => {
    var callbackObj = {
      success: this.updateShotPhoto,
      shotIndex: this.state.shotInFocus,
      progress: this.uploadProgress
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
                    updateMediaPart = {this.updateMediaPart}
                    data = {this.state}
                  />
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
        </div>
      );
  }
}

export default Create;
