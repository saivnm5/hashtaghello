import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bgImg from '../assets/bg.jpg';

class StoryBoard extends Component {

    constructor(props){
        super(props);

        this.state = {
            img: bgImg
        }
    }

    render(){
        return(
            <div className="pseudo-container storyboard" style={ { backgroundImage: 'url("'+this.state.img+'")' } }>

                <div className="nav-header">
                    <div className="btn">
                      <Link to="/">Back</Link>
                    </div>
                    <div className="btn right-align" onClick={this.props.createStory} >
                      Publish
                    </div>
                </div>

                <div className="sceneboard">
                    <div className="left-marker">
                        &lt;
                    </div>
                    <div className="scene-shot">
                    </div>
                    <div className="scene-shot">
                    </div>
                    <div className="scene-shot">
                    </div>
                    <div className="scene-shot">
                    </div>
                    <div className="right-marker">
                        &gt;
                    </div>
                </div>
            </div>
        )
    }
}

export default StoryBoard;