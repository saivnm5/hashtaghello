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
        shotB[index].animationClass = '';
        shotB[index+1].animationClass = '';
        this.setState({
            shots: shotB
        });
    }

    moveRight = (index) => {
        var comp = this;
        var shotB = this.state.shots;
        shotB[index].animationClass = 'shift-right';
        this.setState({
            shots: shotB
        });

        setTimeout(function(){
            comp.changeOrder(index);
        }, 510)
    }

    Shots = () => {
        var shots = [];
        for(var i=0; i < this.state.shots.length; i++){
            var animationClass = '';
            if(this.state.shots[i].animationClass){ animationClass = this.state.shots[i].animationClass; }

            shots.push(
                <Shot
                    order={i}
                    key={i}
                    content={this.state.shots[i].content}
                    moveRight={this.moveRight}
                    animationClass={animationClass}
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
                    <div className="scene-list">
                        <this.Shots />
                    </div>
                </div>

            </div>
        )
    }
}

export default StoryBoard;