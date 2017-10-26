import React, { Component } from 'react';
import Story from '../stories/Story';
import axios from 'axios';

class List extends Component {

    constructor(props){
        super(props)

        this.state = {
            stories: []
        }
    }

    componentWillMount(){

        var comp = this;
        var apiRoot = localStorage.getItem('apiRoot');
        var data = {
            query: "{ stories { id \n hashtag \n description \n imgKey \n thumbnailUrl \n mediaUrl } }"
        }
        axios({
          method: 'post',
          url: apiRoot+'/public',
          data: data
        }).then(function(response){
            var data = response.data.data;
            comp.setState({
                stories: data.stories
            })
        });

    }

    render() {
        var rows = []; var text = '';
        var stories = this.state.stories;
        for (var i=0; i < stories.length; i++) {
            rows.push(<Story data={stories[i]} key={i} type={this.props.type} />);
        }
        if(this.props.type === "home"){
            text = 'stories from around the world';
        }
        else if(this.props.type === "profile"){
            text = 'your stories';
        }

        return (
            <div className="list">
                <div className="list-header">
                    <div className="font-sub-heading">{text}</div>
                </div>
                <div className="list-body">
                    {rows}
                </div>
            </div>
        );
    }
}

export default List;