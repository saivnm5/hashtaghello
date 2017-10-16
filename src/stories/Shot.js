import React, { Component } from 'react';
import bgImg from '../assets/bg.jpg';


class Shot extends Component {
    constructor(props){
        super(props);
        var style = { order: this.props.order };
        if(this.props.content){
            style.backgroundImage = 'url("'+this.props.content+'")';
        }
        else{
            style.backgroundImage = 'url("'+bgImg+'")';
        }
        this.state = {
            order: this.props.order,
            style: style
        }
    }

    moveRight = () => {
        this.props.moveRight(this.state.order)
    }

    render(){
        return(
            <div
                className={"scene-shot "+this.props.animationClass}
                style={this.state.style}
            >
                <div
                    className="move-left"
                    onClick={this.moveRight}
                >
                    &lt;
                </div>

                <div className="upload-trigger">

                </div>

                <div
                    className="move-right"
                    onClick={this.moveRight}
                >
                    &gt;
                </div>
            </div>
        );
    }
}

export default Shot;