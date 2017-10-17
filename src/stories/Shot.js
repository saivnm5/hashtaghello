import React, { Component } from 'react';
import bgImg from '../assets/bg.jpg';
import {getImgUrl} from '../utils/aws';


class Shot extends Component {
    constructor(props){
        super(props);

        this.state = {
            order: this.props.order,
            style: this.getStyle(this.props)
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            order: newProps.order,
            style: this.getStyle(newProps)
        });
    }

    getStyle = (props) => {
        var style = { order: props.order };
        if(props.imgKey){
            var url = getImgUrl(props.imgKey, 'thumbnail');
            style.backgroundImage = 'url("'+url+'")';
        }
        else{
            style.backgroundImage = 'url("'+bgImg+'")';
        }
        return style;
    }

    updateShotInFocus = () => {
        this.props.updateShotInFocus(this.state.order);
    }

    removeShotPhoto = () => {
        this.props.updateShotPhoto(null, this.state.order);
    }

    moveRight = () => {
        this.props.moveShot(this.state.order, 'right')
    }

    moveLeft = () => {
        this.props.moveShot(this.state.order, 'left')
    }

    render(){
        var focusClass = '';
        if(this.props.isFocused){ focusClass = 'focus'; }

        return(
            <div
                className={"scene-shot "+this.props.animationClass+" "+focusClass}
                style={this.state.style}
                onClick={this.updateShotInFocus}
            >
                <div className="scene-options">
                    <div className="action-left" onClick={this.moveLeft} >
                        <i className="fa fa-rotate-left"></i>
                    </div>
                    <div className="action-left" onClick={this.props.triggerUpload} >
                        <i className="fa fa-camera-retro"></i>
                    </div>
                    <div className="action-right" onClick={this.removeShotPhoto} >
                        <i className="fa fa-trash"></i>
                    </div>
                    <div className="action-right" onClick={this.moveRight} >
                        <i className="fa fa-rotate-right"></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default Shot;