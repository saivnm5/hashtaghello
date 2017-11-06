import React, { Component } from 'react';
import bgImg from '../assets/img/bg.jpg';
import {getImgUrl} from '../utils/simpl';


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
        var url = bgImg;
        if(props.data.mediaUrl){
            url = props.data.thumbnailUrl;
        }
        else if (props.data.imgKey){
            if(this.props.data.isNew === true){
                url = getImgUrl(props.data.imgKey);
            }
            else{
                url = getImgUrl(props.data.imgKey, 'thumb');
            }
        }
        style.backgroundImage = 'url("'+url+'")';
        return style;
    }

    updateShotInFocus = () => {
        this.props.updateShotInFocus(this.state.order);
    }

    removePart = () => {
        this.props.removePart(this.state.order);
    }

    moveRight = () => {
        this.props.moveShot(this.state.order, 'right')
    }

    moveLeft = () => {
        this.props.moveShot(this.state.order, 'left')
    }

    render(){
        var focusClass = ''; var optionLeft = null; var optionClose = null; var optionRight = null;
        if(this.props.isFocused){ focusClass = 'focus'; }
        if(this.state.order !== 0){
            optionLeft = (
                <div onClick={this.moveLeft} >
                    <i className="fa fa-arrow-left"></i>
                </div>
            );
        }
        if(this.props.data.imgKey || this.props.data.mediaUrl){
            optionClose = (
                <div onClick={this.removePart} >
                    <i className="fa fa-trash"></i>
                </div>
            );
        }
        optionRight = (
            <div onClick={this.moveRight} >
                <i className="fa fa-arrow-right"></i>
            </div>
        );

        return(
            <div
                className={"scene-shot "+this.props.animationClass+" "+focusClass}
                style={this.state.style}
                onClick={this.updateShotInFocus}
            >
                <div className="scene-options">
                    {optionLeft}
                    {optionClose}
                    {optionRight}
                </div>
            </div>
        );
    }
}

export default Shot;