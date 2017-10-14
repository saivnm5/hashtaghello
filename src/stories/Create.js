import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Create extends Component {

  constructor(props){
    super(props)

    this.state = {
        hashtag: '#',
        description: '',
        story: null
    }
  }

  handleTagChange = (event) => {
    if(event.target.value && event.target.value.length <= 30){
      this.setState({
        hashtag: event.target.value
      })
    }
  }

  handleDescriptionChange = (event) => {
    if(event.target.value.length <= 100){
      this.setState({
        description: event.target.value
      })
    }
  }

  createStory = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "mutation createStory($input: StoryInput) { \n createStory(input: $input) \n }",
        variables: {
          input:{
            hashtag: this.state.hashtag,
            description: this.state.description
          }
        }
    }
    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then(function(response){
        var data = response.data.data;
        comp.setState({
            story: data.createStory
        })
    });
  }

  render() {
    return (
        <div className="container">

          <div className="nav-header">
            <div className="btn">
              <Link to="/">Back</Link>
            </div>
            <div className="btn right-align" onClick={this.createStory} >
              Start
            </div>
          </div>

          <div className="create-body">
            <div className="font-heading">Hello Sai,</div>
            <div className="font-sub-heading">What's your story?</div>
            <br/><br/>
            <div>
              <input
                type="text"
                className="form hashtag"
                value={this.state.hashtag}
                onChange={this.handleTagChange}
              />
            </div>
            <br/>
            <div>
              <textarea
                className="form"
                placeholder="Description"
                value={this.state.description}
                onChange={this.handleDescriptionChange}
              />
            </div>
          </div>

        </div>
    );
  }
}

export default Create;
