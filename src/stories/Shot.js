import React, { Component } from 'react';


class Shot extends Component {
    constructor(props){
        super(props);
        this.state = {
            order: this.props.order
        }
    }

    changeOrder = () => {
        this.props.changeOrder(this.state.order)
    }
    render(){
        return(
            <div
                className="scene-shot"
                style={{order: this.state.order}}
                onClick={this.changeOrder}
            >
                {this.props.content}
            </div>
        );
    }
}

export default Shot;