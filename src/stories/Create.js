import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor(props){
    super(props)

    this.state = {
        hashtag: '#',
        description: ''
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

  render() {
    return (
        <div className="container">

          <div className="nav-header">
            <div className="btn">
              <Link to="/">Back</Link>
            </div>
            <div className="btn right-align">
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
