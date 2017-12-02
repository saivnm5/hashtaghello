import React, { Component } from 'react';
import { getImgUrl } from '../utils/simpl';
import { getOembedData } from '../utils/oembed.js';

class ViewPart extends Component {

	constructor(props){
		super(props);
		this.state = {
			mediaHTML: this.getMediaHTML(props)
		};
	}

	componentWillReceiveProps = (props) => {
		this.setState({
			mediaHTML: this.getMediaHTML(props)
		})
	}

	getMediaHTML = (props) => {
		var comp = this;
		let media = null;
		if(props.data.mediaUrl && props.load === true){
			var callOembed = getOembedData(props.data.mediaUrl);
        callOembed.then(function(response){
            let oembedData = response.data.data.oembed;
            media = <div className="body" dangerouslySetInnerHTML={{__html: oembedData.html}} />;
        });
		}
		else if(props.data.text){
			media = <div className="text-body" dangerouslySetInnerHTML={{__html: props.data.text}} />;
		}
		return media;
	}

	render(){
		var style = {};
		if(this.props.data.imgKey){
			var imgUrl = getImgUrl(this.props.data.imgKey, 'full');
			style.backgroundImage = 'url("'+imgUrl+'")';
		}
		else{
			style.background = 'none';
		}

		if(this.props.load === true){
			return (
				<div className={"part "+this.props.activeClass} style={ style }>
					{this.state.mediaHTML}
				</div>
			);
		}
		else{
			return (
				<div className="part ">
				</div>
			);
		}
	}

}

export default ViewPart;