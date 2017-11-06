import React, { Component } from 'react';
import { getShareUrl, getImgUrl } from '../utils/simpl';
import Img from 'react-image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


class Publish extends Component {

    constructor(props){
        super(props);
        var option = this.getPrivacy(props);
        this.state = {
            option: option,
            isPublished: false,
            publishBtnTxt: 'Publish',
            shareUrl: '',
            allowPayment: props.data.allowPayment
        };
    }

    componentWillReceiveProps(newProps) {
        var option = this.getPrivacy(newProps);
        this.setState({
            option: option,
            allowPayment: newProps.data.allowPayment
        });
    }

    getPrivacy = (props) => {
        var option = '';
        if(props.data.isPrivate){
            option = 'private';
        }
        else{
            option = 'public';
        }
        return option;
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

    togglePaymentOption = () => {
        var option = true;
        if(this.state.allowPayment === true){
            option = false;
        }
        this.setState({
            allowPayment: option
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
                isPrivate: isPrivate,
                allowPayment: this.state.allowPayment
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
            var shareUrl = getShareUrl(this.props.data.story, data.publishStory);
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
        var part = this.props.data.shots[0];
        if(part.mediaUrl && part.mediaUrl !== ''){
            imgUrl = [part.thumbnailUrl];
        }
        else if (part.imgKey){
            imgUrl = getImgUrl(part.imgKey, 'thumb-all');
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
        var showPublicOptionsClass = 'hide';
        var showPublishNavClass = 'hide';
        if(this.state.option === 'public'){
            showPublicOptionsClass = 'show';
        }
        if(this.state.isPublished){
            showOptionsClass = 'hide';
            showShareClass = 'show';
            showPublishBtnClass = 'hide';
            showPublishedClass = 'show';
            showPublicOptionsClass = 'hide';
            showPublishNavClass = 'show';
        }


        return(
            <div className="pseudo-container">

                <div className="nav-header">
                    <div className="btn" onClick={this.goBack}>
                      back
                    </div>
                    <div className={"btn right-align "+showPublishNavClass} >
                      <Link to="/profile">done</Link>
                    </div>
                </div>

                <div className="publish-body">
                    {snapshotComp}
                    <br/><br/>
                    <div className={"font-sub-heading "+showOptionsClass}>
                        publish as
                    </div>

                    <div className={showOptionsClass}>
                        <div className={"publish-option "+this.state.option}>
                            <div className="font-heading private" onClick={this.toggleOption}>
                                private
                            </div>
                            <div className="font-sub-heading">
                                visible if u share
                            </div>
                        </div>
                        <div className={"publish-option "+this.state.option}>
                            <div className="font-heading public" onClick={this.toggleOption}>
                                public
                            </div>
                            <div className="font-sub-heading">
                                out there
                            </div>
                        </div>
                    </div>

                    <br/>

                    <div className={"font-sub-heading "+showPublicOptionsClass}>
                        allow payment?
                    </div>

                    <div className={showPublicOptionsClass}>
                        <div className="font-heading payment-option">
                            <div className={"yes "+this.state.allowPayment} onClick={this.togglePaymentOption}>
                                yes
                            </div>
                            <div className={"no "+this.state.allowPayment} onClick={this.togglePaymentOption}>
                                no
                            </div>
                        </div>
                    </div>
                    <br/><br/>

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