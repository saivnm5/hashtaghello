import React, { Component } from 'react';
import { getImgUrl, imageExists } from '../utils/aws';
import { getOembedData } from '../utils/oembed.js';

class ViewPart extends Component {

	constructor(props){
		super(props);
		this.state = {
			mediaHTML: null
		};
	}

	componentWillMount = () => {
		var comp = this;
		var mediaUrl = this.props.data.mediaUrl;
		if(mediaUrl){
			var callOembed = getOembedData(mediaUrl);
        callOembed.then(function(response){
            var oembedData = response.data.data.oembed;
            var media = <div className="body" dangerouslySetInnerHTML={{__html: oembedData.html}} />;
            comp.setState({
            	mediaHTML: media
            });
        });
		}
	}

	render(){
		var style = {};
		if(this.props.data.imgKey){
			var imgUrl = getImgUrl(this.props.data.imgKey, 'full');
			//if(!imageExists(imgUrl)){
				//imgUrl = getImgUrl(this.props.data.imgKey);
			//}
			style.backgroundImage = 'url("'+imgUrl+'")';
		}
		else{
			style.background = 'none';
		}

		return(
			<div className={"part "+this.props.activeClass} style={ style }>
				{this.state.mediaHTML}
			</div>
		);
	}

}

export default ViewPart;