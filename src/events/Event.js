import React, { Component } from 'react';

class Event extends Component {

    handleOutboundLink = (url) => {
        window.ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: url,
            transport: 'beacon'
        });
    }

    render() {
        let media = null;
        if(this.props.data.mediaIsVideo){
            media = <video autoPlay loop><source src={this.props.data.media} type="video/mp4" /></video>;
        }
        else{
            media =  <img src={this.props.data.media} alt="event's name" />;
        }

        return (
            <div className="event">
                <div className="event-media">
                    {media}
                </div>
                <div className="event-content">
                    <div className="font-heading">
                        <a
                            href={this.props.data.link}
                            target="_blank"
                            onClick={() => this.handleOutboundLink(this.props.data.link)}
                        >
                            {this.props.data.hashtag}
                        </a>
                    </div>
                    <div className="font-sub-heading">{this.props.data.location}</div>
                    <div className="font-sub-heading">{this.props.data.date}</div>
                </div>
            </div>
        );
    }
}

export default Event;