import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class ChooseHashtag extends Component {

    render(){
        return(
            <div className="pseudo-container">
                <div className="nav-header">
                    <div className="btn">
                      <Link to="/">Back</Link>
                    </div>
                    <div className="btn right-align" onClick={this.props.createStory} >
                      Start
                      <input
                        type="file"
                        accept="image/*"
                        ref={(input) => { this.firstImageInput = input; }}
                        style={{display:'none'}}
                        onChange = {this.props.handleImageUpload}
                      />
                    </div>
                </div>

                <div className="create-body">
                    <div className="font-heading">Hello Stranger,</div>
                    <div className="font-sub-heading">What's your story?</div>
                    <br/><br/>
                    <div>
                      <input
                        type="text"
                        className="form hashtag"
                        value={this.props.data.hashtag}
                        onChange={this.props.handleTagChange}
                      />
                    </div>
                    <br/>
                    <div>
                      <textarea
                        className="form"
                        placeholder="Description"
                        value={this.props.data.description}
                        onChange={this.props.handleDescriptionChange}
                      />
                    </div>
                </div>
            </div>
        )
    }
}

export default ChooseHashtag;