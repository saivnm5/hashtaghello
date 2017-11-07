import React, { Component } from 'react';
import {getImgUrl} from '../utils/simpl';
import View from './View';
import Img from 'react-image';

class Story extends Component {

    constructor(props){
        super(props);
        this.state = {
            viewStory: false
        };
        this.triggerEdit = this.triggerEdit.bind(this);
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
        var url = '/storyboard/'+this.props.data.slug;
        window.location.href = url;
    }

    render() {
        let imgUrl = null;
        if(this.props.data.imgKey){
            imgUrl = getImgUrl(this.props.data.imgKey, 'full');
        }
        else if(this.props.data.thumbnailUrl){
            imgUrl = this.props.data.thumbnailUrl;
        }
        let style = { backgroundImage : 'url("'+imgUrl+'")'};
        var viewComp = null;
        if(this.state.viewStory){
            viewComp = <View slug={this.props.data.slug} closeStory={this.closeStory} />
        }
        var Edit = null;
        if(this.props.type === "profile"){
            Edit = (
                <div className="font-sub-heading right-align btn" onClick={this.triggerEdit} >
                    edit
                </div>
            );
        }

        return (
            <div className="story">
                <div className="story-media" onClick={this.viewStory} style={style}>
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
                {viewComp}
            </div>
        );
    }
}

export default Story;