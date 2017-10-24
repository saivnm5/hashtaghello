import React, { Component } from 'react';
import {getImgUrl} from '../utils/aws';
import Shot from './Shot';
import { isUrl } from '../utils/validations';
import { getRootDomain } from '../utils/simpl.js';
import { getOembedData } from '../utils/oembed.js';


const defaultState = {
    inputType: 'image' // options: image/audio/video
};

class StoryBoard extends Component {
    constructor(props){
        super(props);

        var media = this.getMedia(props.data);
        this.state = {
            img: media.img,
            mediaHTML: media.mediaHTML,
            shots: this.props.data.shots,
            mediaUrl: '',
            inputType: defaultState.inputType,
            inputError: '',
            inputSaveBtnTxt: 'Save'
        };
        this.updatePart = this.updatePart.bind(this);
    }

    goBack = () => {
        this.props.changeStage(0);
    }

    componentWillReceiveProps(newProps) {
        var media = this.getMedia(newProps.data);
        var inputState = {
            inputType: this.state.inputType,
            inputError: this.state.inputError,
            inputSaveBtnTxt: this.state.inputSaveBtnTxt,
            mediaUrl: this.state.mediaUrl
        };
        if(newProps.data.shotInFocus !== this.props.data.shotInFocus){
            inputState = {
                inputType: defaultState.inputType,
                inputError: '',
                inputSaveBtnTxt: '',
                mediaUrl: ''
            };
        }
        this.setState({
            img: media.img,
            mediaHTML: media.mediaHTML,
            shots: newProps.data.shots,
            shotInFocus: newProps.data.shotInFocus,
            inputType: inputState.inputType,
            inputError: inputState.inputError,
            inputSaveBtnTxt: inputState.inputSaveBtnTxt,
            mediaUrl: inputState.mediaUrl
        });
    }

    getMedia = (propsData) => {
        var content = { img: null, mediaHTML: null };
        var shotInFocus = propsData.shotInFocus;
        if(propsData.shots[shotInFocus].url){
            content.mediaHTML = propsData.shots[shotInFocus].mediaHTML;
        }
        else if(propsData.shots[shotInFocus].imgKey){
            content.img = getImgUrl(propsData.shots[shotInFocus].imgKey);
        }
        return content;
    }

    changeOrder = (index, direction) => {
        var shotB = this.state.shots;
        var temp = shotB[index];
        var shotInFocus = index + 1;
        if(direction === 'left'){ shotInFocus = index -1; }

        shotB.splice(index,1);
        shotB.splice(shotInFocus, 0, temp);
        shotB[index].animationClass = '';
        shotB[shotInFocus].animationClass = '';
        this.props.updateShots(shotB, shotInFocus);
    }

    moveShot = (index, direction) => {
        var comp = this;
        var shotB = this.state.shots;
        shotB[index].animationClass = 'shift-'+direction;
        this.props.updateShots(shotB);

        setTimeout(function(){
            comp.changeOrder(index, direction);
        }, 510);
    }

    Shots = () => {
        var shots = [];
        for(var i=0; i < this.state.shots.length; i++){
            var isFocused = false;
            var animationClass = '';
            if(i === this.props.data.shotInFocus){ isFocused = true; }
            if(this.state.shots[i].animationClass){ animationClass = this.state.shots[i].animationClass; }

            shots.push(
                <Shot
                    order={i}
                    key={i}
                    imgKey={this.state.shots[i].imgKey}
                    url={this.state.shots[i].url}
                    moveShot={this.moveShot}
                    animationClass={animationClass}
                    isFocused={isFocused}
                    updateShotInFocus={this.props.updateShotInFocus}
                    updateShotPhoto={this.props.updateShotPhoto}
                    removePart={this.props.removePart}
                />
            );
        }
        return shots;
    }

    selectInputType = (inputType) => {
        this.setState({
            inputType: inputType,
            inputError: '',
            inputSaveBtnTxt: 'Save'
        });
    }

    mediaPartValid = (url) => {

        if(!isUrl(url)){
            this.setState({
                inputError: 'invalid URL'
            });
        }
        else{
            var domain = getRootDomain(url);
            if(this.state.inputType === 'audio'){
                if( domain !== 'soundcloud.com' ){
                    this.setState({
                        inputError: 'sorry, we currently only accept soundcloud links'
                    });
                }
                else{
                    return true;
                }
            }
            else if(this.state.inputType === 'video'){
                if( domain !== 'youtube.com' && domain !== 'vimeo.com' ){
                    this.setState({
                        inputError: 'sorry, we currently only accept youtube/vimeo links'
                    });
                }
                else{
                    return true;
                }
            }
        }
    }

    updatePart = () => {
        var comp = this;
        if( this.mediaPartValid(this.state.mediaUrl) ){
            this.setState({
                inputSaveBtnTxt: 'Saving...'
            });
            var callOembed = getOembedData(this.state.mediaUrl);
            callOembed.then(function(response){
                var oembedData = response.data.data.oembed;
                comp.props.updatePart(
                    comp.props.data.shotInFocus,
                    comp.state.inputType,
                    comp.state.mediaUrl,
                    oembedData
                );
            });
        }
    }

    handleMediaUrlChange = (event) => {
        this.setState({
            mediaUrl: event.target.value
        });
    }

    mediaInputComp = (placeholder) => {
        return(
            <div className="input">
                <div>
                    <input type="text" className="form"
                        placeholder={placeholder}
                        onChange={this.handleMediaUrlChange}
                        value={this.state.mediaUrl}
                    />
                </div>
                <div>
                    <div className="font-error">{this.state.inputError}</div>
                    <div className="btn right-align" onClick={this.updatePart} >
                        {this.state.inputSaveBtnTxt}
                    </div>
                </div>
            </div>
        );
    }

    mediaInputObj = () => {
        var mediaInput = { audio: null, video: null}

        if(this.state.inputType !== 'image'){
            var placeholder = '';
            if(this.state.inputType === 'audio'){
                placeholder = 'SoundCloud URL';
                mediaInput.audio = this.mediaInputComp(placeholder);
            }
            else if(this.state.inputType === 'video'){
                placeholder = 'Youtube/Vimeo URL';
                mediaInput.video = this.mediaInputComp(placeholder);
            }
        }
        return mediaInput;
    }

    emptyState = () => {
        var mediaInput = this.mediaInputObj();

        var emptyState = (
            <div className="storyboard-body font-heading">
                <div>
                    Upload
                </div>
                <div className="upload-options">
                    <div onClick={this.props.triggerUpload}>
                        <i className="fa fa-camera-retro"></i>
                        &nbsp;&nbsp;<span className="btn ">Image</span>
                    </div>
                    <div onClick={() => this.selectInputType('audio')}>
                        <i className="fa fa-music"></i>
                        &nbsp;&nbsp;<span className="btn ">Audio</span>&nbsp;
                        <span className="font-sub-heading">(via soundcloud)</span>
                    </div>
                    {mediaInput.audio}
                    <div onClick={() => this.selectInputType('video')}>
                        <i className="fa fa-film"></i>
                        &nbsp;&nbsp;<span className="btn ">Video</span>&nbsp;
                        <span className="font-sub-heading">(via youtube/vimeo)</span>
                    </div>
                    {mediaInput.video}
                </div>

            </div>
        );
        return emptyState;
    }

    render(){
        var boardBody = null;
        if(!this.state.img && !this.state.mediaHTML){
            boardBody = this.emptyState();
        }
        else if(this.state.mediaHTML){
            //boardBody = this.state.mediaHTML;
            boardBody = <div className="storyboard-body" dangerouslySetInnerHTML={{__html: this.state.mediaHTML}} />;
        }

        if(this.props.data.uploadInProgress){
            boardBody = (
                <div className="storyboard-body">
                    <div className="font-heading">Uploading: {this.props.data.uploadPercentage}%</div>
                </div>
            );
        }


        return(
            <div className="pseudo-container storyboard" style={ { backgroundImage: 'url("'+this.state.img+'")' } }>

                <div className="nav-header">
                    <div className="btn" onClick={this.goBack}>
                      Back
                    </div>
                    <div className="btn right-align" onClick={this.props.saveStory} >
                      Publish
                    </div>
                </div>

                {boardBody}

                <div className="scene-board">
                    <div className="scene-list">
                        <this.Shots />
                    </div>
                </div>

            </div>
        )
    }
}

export default StoryBoard;