import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {getImgUrl} from '../utils/aws';
import { getShareUrl } from '../utils/simpl';
import Img from 'react-image';
import axios from 'axios';
import { toast } from 'react-toastify';


class Publish extends Component {

    constructor(props){
        super(props);
        this.state = {
            option: 'private',
            isPublished: false,
            publishBtnTxt: 'Publish',
            shareUrl: ''
        };
    }

    goBack = () => {
        this.props.changeStage(1);
    }

    toggleOption = () => {
        var option = 'public';
        if(this.state.option === 'public'){
            option = 'private';
        }
        this.setState({
            option: option
        });
    }

    publishStory = () => {
        this.setState({
            publishBtnTxt: 'Publishing...'
        });
        var comp = this;
        var apiRoot = localStorage.getItem('apiRoot');
        let headers = { "Authorization" : localStorage.getItem("authToken") };

        var isPrivate = true;
        if(this.state.option === 'public'){
            isPrivate = false;
        }
        var data = {
            query: "mutation publishStory($input: PublishInput) { \n publishStory(input: $input) \n }",
            variables: {
              input:{
                story: this.props.data.story,
                isPrivate: isPrivate
              }
            }
        };

        axios({
          method: 'post',
          url: apiRoot+'/api',
          headers: headers,
          data: data
        }).then(function(response){
            var data = response.data.data;
            var shareUrl = getShareUrl(data.publishStory);
            comp.setState({
                shareUrl: shareUrl,
                isPublished: true
            });
        }).catch(function(response){
            comp.setState({
                publishBtnTxt: 'Publish'
            });
            toast.error("Sorry, the story could not be published. Maybe, try again?");
        });
    }

    render(){
        var imgUrl = null;
        var partIndex = this.props.data.shotInFocus;
        var part = this.props.data.shots[partIndex];
        if(part.mediaUrl && part.mediaUrl !== ''){
            imgUrl = [part.thumbnailUrl];
        }
        else if (part.imgKey){
            imgUrl = getImgUrl(part.imgKey, 'all');
        }

        var snapshotComp = (
            <div className="snapshot">
                <div className="image">
                    <Img src={imgUrl} alt={this.props.data.hashtag} />
                </div>
                <div className="hashtag font-heading">
                    {this.props.data.hashtag}
                </div>
            </div>
        );

        var showOptionsClass = 'show';
        var showShareClass = 'hide';
        var showPublishBtnClass = 'show';
        var showPublishedClass = 'hide';
        if(this.state.isPublished){
            showOptionsClass = 'hide';
            showShareClass = 'show';
            showPublishBtnClass = 'hide';
            showPublishedClass = 'show';
        }

        return(
            <div className="pseudo-container">
                <div className="nav-header">
                    <div className="btn" onClick={this.goBack}>
                      <Link to="/profile">Back</Link>
                    </div>
                    <div className="btn right-align hide">
                      done
                    </div>
                </div>

                <div className="publish-body">
                    {snapshotComp}
                    <br/><br/>
                    <div className={"font-sub-heading "+showOptionsClass}>
                        publish story as
                    </div>

                    <div className={showOptionsClass}>
                        <div className={"publish-option "+this.state.option}>
                            <div className="font-heading private" onClick={this.toggleOption}>
                                Private
                            </div>
                            <div className="font-sub-heading">
                                visible to you &
                            </div>
                            <div className="font-sub-heading">
                                people you share with
                            </div>
                        </div>
                        <div className={"publish-option "+this.state.option}>
                            <div className="font-heading public" onClick={this.toggleOption}>
                                Public
                            </div>
                            <div className="font-sub-heading">
                                visible to the world,
                            </div>
                            <div className="font-sub-heading">
                                payment enabled
                            </div>
                        </div>
                    </div>
                    <br/>

                    <div className={showPublishBtnClass}>
                        <span className="font-heading btn" onClick={this.publishStory}>
                            {this.state.publishBtnTxt}
                        </span>
                    </div>
                    <div className={showPublishedClass}>
                        <span className="font-heading">
                            Published!
                        </span>
                    </div>
                    <br/><br/>

                    <div className={showShareClass}>
                        <a target="_blank" href={"https://twitter.com/intent/tweet?button_hashtag="+this.props.data.hashtag.replace(/^#/, '')+"&url="+this.state.shareUrl} rel="noopener noreferrer">
                                <i className="fa fa-twitter"></i>&nbsp;
                                {this.props.data.hashtag}
                            </a>
                    </div>
                    <br/>

                    <div className={showShareClass}>
                        <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u="+this.state.shareUrl} rel="noopener noreferrer">
                            <i className="fa fa-facebook"></i>&nbsp;
                            Share
                        </a>
                    </div>

                </div>
            </div>
        )
    }
}

export default Publish;