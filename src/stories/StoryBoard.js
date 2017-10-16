import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bgImg from '../assets/bg.jpg';
import Shot from './Shot';


var shots = [
    {
        content: 'something0'
    },
    {
        content: 'something1'
    },
    {
        content: 'something2'
    },
    {
        content: 'something3'
    },
    {
        content: 'something4'
    },
    {
        content: 'something5'
    },
    {
        content: 'something6'
    },
    {
        content: 'something7'
    },
    {
        content: 'something8'
    }
]

class StoryBoard extends Component {

    constructor(props){
        super(props);

        this.state = {
            img: bgImg,
            shots: shots
        }
    }

    changeOrder = (index) => {
        var shotB = this.state.shots;
        var temp = shotB[index];
        shotB.splice(index,1);
        shotB.splice(index+1, 0, temp);
        this.setState({
            shots: shotB
        });
    }

    Shots = () => {
        var shots = [];
        for(var i=0; i < this.state.shots.length; i++){
            shots.push(
                <Shot
                    order={i}
                    key={i}
                    content={this.state.shots[i].content}
                    changeOrder={this.changeOrder}
                />
            );
        }
        return shots;
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

                <div className="scene-board">
                    <div className="left-marker">
                        &lt;
                    </div>
                    <div className="scene-list">
                        <this.Shots />
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