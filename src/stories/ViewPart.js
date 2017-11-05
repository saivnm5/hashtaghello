import React, { Component } from 'react';
import { getImgUrl } from '../utils/simpl';
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
		if(mediaUrl && this.props.load === true){
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