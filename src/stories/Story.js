import React, { Component } from 'react';
import {getImgUrl} from '../utils/aws';

class Event extends Component {

    render() {
        let img = getImgUrl(this.props.data.imgKey);
        let media = <img src={img} alt={this.props.data.hashtag} />;

        return (
            <div className="event">
                <div className="event-media">
                    {media}
                </div>
                <div className="event-content">
                    <div className="font-heading">
                        #{this.props.data.hashtag}
                    </div>
                    <div className="font-sub-heading">{this.props.data.description}</div>
                </div>
            </div>
        );
    }
}

export default Event;