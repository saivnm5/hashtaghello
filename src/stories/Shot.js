import React, { Component } from 'react';


class Shot extends Component {
    constructor(props){
        super(props);
        this.state = {
            order: this.props.order
        }
    }

    moveRight = () => {
        this.props.moveRight(this.state.order)
    }

    render(){
        return(
            <div
                className={"scene-shot "+this.props.animationClass}
                style={{order: this.state.order}}
            >
                <div
                    className="move-left"
                    onClick={this.moveRight}
                >
                    &lt;
                </div>
                    {this.props.content}
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