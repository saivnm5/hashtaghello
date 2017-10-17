import React, { Component } from 'react';
import {uploadPhoto} from '../utils/aws';
import ChooseHashtag from './ChooseHashtag';
import StoryBoard from './StoryBoard';

const STAGES = [
  'HASHTAG',
  'STORYBOARD',
  'PUBLISH'
];


class Create extends Component {

  constructor(props){
    super(props);
    var shots = [];
    for(var i=0; i<10; i++){
      shots.push({imgKey: null, originalOrder: i});
    }

    this.state = {
        hashtag: '#',
        description: '',
        stage: STAGES[0],
        story: null,
        shots: shots,
        shotInFocus: 0,
        uploadInProgress: false,
        uploadPercentage: 0
    };
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
    /*
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "mutation createStory($input: StoryInput) { \n createStory(input: $input) \n }",
        variables: {
          input:{
            hashtag: this.state.hashtag,
            description: this.state.description
          }
        }
    }

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var data = response.data.data;
        comp.setState({
            story: data.createStory
        });
    });
    */
    this.setState({
      stage: STAGES[1]
    });
    this.firstImageInput.click();
  }

  updateShot = (imgKey, shotIndex) => {
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
      success: this.updateShot,
      shotIndex: 0,
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
                    createStory = {this.createStory}
                    updateShots = {this.updateShots}
                    data = {this.state}
                  />
    }
      return(
        <div className="container">
          {currentStage}
          <input
            type="file"
            accept="image/*"
            ref={(input) => { this.firstImageInput = input; }}
            style={{display:'none'}}
            onChange = {this.handleImageUpload}
          />
        </div>
      );
  }
}

export default Create;
