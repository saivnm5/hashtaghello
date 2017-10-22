import React, { Component } from 'react';
import {getImgUrl} from '../utils/aws';
import Shot from './Shot';


class StoryBoard extends Component {
    constructor(props){
        super(props);

        this.state = {
            img: this.deriveImgUrl(this.props.data),
            shots: this.props.data.shots,
            shotInFocus: this.props.data.shotInFocus
        }
    }

    goBack = () => {
        this.props.changeStage(0);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            img: this.deriveImgUrl(newProps.data),
            shots: newProps.data.shots,
            shotInFocus: newProps.data.shotInFocus
        });
    }

    deriveImgUrl = (propsData) => {
        var shotInFocus = propsData.shotInFocus;
        var imgKey = propsData.shots[shotInFocus].imgKey;
        if(imgKey === null){
            return null;
        }
        else{
            return getImgUrl(imgKey);
        }
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
                    moveShot={this.moveShot}
                    animationClass={animationClass}
                    isFocused={isFocused}
                    originalOrder={this.state.shots[i].originalOrder}
                    updateShotInFocus={this.props.updateShotInFocus}
                    updateShotPhoto={this.props.updateShotPhoto}
                />
            );
        }
        return shots;
    }

    emptyState = () => {
        var emptyState = (
            <div className="storyboard-body font-heading">
                <div className="">
                    Upload
                </div>
                <ul className="upload-options">
                    <li onClick={this.props.triggerUpload}>
                        <i className="fa fa-camera-retro"></i>
                        &nbsp;&nbsp;<span className="btn">Image</span>
                    </li>
                    <li>
                        <i className="fa fa-music"></i>
                        &nbsp;&nbsp;<span className="btn">Audio</span> (via soundcloud)
                    </li>
                    <li>
                        <i className="fa fa-film"></i>
                        &nbsp;&nbsp;<span className="btn">Video</span> (via youtube/vimeo)
                    </li>
                </ul>
            </div>
        );
        return emptyState;
    }

    render(){
        var boardBody = null;
        if(!this.state.img){
            boardBody = this.emptyState();
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