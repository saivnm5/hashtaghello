import React, { Component } from 'react';
import { getImgUrl, getLines } from '../utils/simpl';
import { getOembedData } from '../utils/oembed.js';

class ViewPart extends Component {

	constructor(props){
		super(props);
		this.state = {
			mediaHTML: null
		};
	}

	componentDidMount(){
		this.setMediaHTML(this.props);
	}

	componentWillReceiveProps = (props) => {
		this.setMediaHTML(props);
	}

	setMediaHTML = (props) => {
		let comp = this;
		let media = null;
		if(props.data.mediaUrl && props.load === true){
			var callOembed = getOembedData(props.data.mediaUrl);
        callOembed.then(function(response){
            let oembedData = response.data.data.oembed;
						media = <div className="body" dangerouslySetInnerHTML={{__html: oembedData.html}} />;
						comp.setState({
							mediaHTML: media
						});
				});
		}
		else if(props.data.text){
			let lines = getLines(props.data.text);
			let text = '';
			for(let line of lines){
				text += line + '<br/>';
			}
			media = <div className="text-body" dangerouslySetInnerHTML={{__html: text}} />;
			comp.setState({
				mediaHTML: media
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