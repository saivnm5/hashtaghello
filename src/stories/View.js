import React, { Component } from 'react';
import axios from 'axios';


class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      storyId: props.match.params.id,
      hashtag: '',
      description: '',
      shots: []
    }
  }

  componentWillMount = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($id: Int!) { \n story(id: $id) { \n hashtag \n description \n shots { \n imgKey \n } \n } \n }",
        variables: {
          id: this.state.storyId
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var story = response.data.data.story;
        comp.setState({
            hashtag: '#'+story.hashtag,
            description: story.description,
            shots: story.shots
        });
    });
  }

  render() {
    return (
      <div className="container view-story">
        {this.state.hashtag}
      </div>
    );
  }
}

export default Home;
