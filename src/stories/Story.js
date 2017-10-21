import React, { Component } from 'react';
import {getImgUrl} from '../utils/aws';
import View from './View';
import Img from 'react-image';

class Story extends Component {

    constructor(props){
        super(props);
        this.state = {
            viewStory: false
        }
    }

    viewStory = () => {
        this.setState({
            viewStory: true
        })
    }

    closeStory = () => {
        this.setState({
            viewStory: false
        });
    }

    triggerEdit = () => {
        var url = '/storyboard/'+this.props.data.id;
        window.location.href = url;
    }

    render() {
        let imgArray = getImgUrl(this.props.data.imgKey, 'all');
        let media = <Img src={imgArray} alt={this.props.data.hashtag} />;
        var view = null;
        if(this.state.viewStory){
            view = <View id={this.props.data.id} closeStory={this.closeStory} />
        }
        var Edit = null;
        if(this.props.type === "home"){
            Edit = (
                <div className="font-sub-heading right-align btn" onClick={this.triggerEdit} >
                    edit
                </div>
            );
        }

        return (
            <div className="story">
                <div className="story-media" onClick={this.viewStory}>
                    {media}
                </div>
                <div className="story-content">
                    <div>
                        <div className="font-heading soft-btn" onClick={this.viewStory} >
                            #{this.props.data.hashtag}
                        </div>
                        {Edit}
                    </div>

                    <div className="font-sub-heading">{this.props.data.description}</div>
                </div>
                {view}
            </div>
        );
    }
}

export default Story;