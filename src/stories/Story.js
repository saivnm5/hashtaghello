import React, { Component } from 'react';
import {getImgUrl} from '../utils/aws';
import { Link } from 'react-router-dom';
import View from './View';

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
        })
    }

    render() {
        let img = getImgUrl(this.props.data.imgKey);
        let media = <img src={img} alt={this.props.data.hashtag} />;
        var view = null;
        if(this.state.viewStory){
            view = <View id={this.props.data.id} closeStory={this.closeStory} />
        }

        return (
            <div className="story">
                <div className="story-media" onClick={this.viewStory}>
                    {media}
                </div>
                <div className="story-content">
                    <div className="font-heading soft-btn" onClick={this.viewStory} >
                        #{this.props.data.hashtag}
                    </div>
                    <div className="font-sub-heading">{this.props.data.description}</div>
                </div>
                {view}
            </div>
        );
    }
}

export default Story;