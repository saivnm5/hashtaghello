import React, { Component } from 'react';

class TheEnd extends Component {

	constructor(props){
		super(props);
		this.state = {
			shareClass: 'hide'
		};
	}

	toggleShare = () => {
		var before = this.state.shareClass;
		var after = 'show';
		if(before === 'show'){
			after = 'hide';
		}
		this.setState({
			shareClass: after
		});
	}

	render(){

		return(
			<div className={"part the-end "+this.props.activeClass}>
				<div className="credits">
					<div className="content">
						<div className="font-sub-heading">this story was brought to you by</div>
						<div className="font-heading">{this.props.data.creator}</div>
					</div>
				</div>
				<div className="payment">
					<div className="content">
						<div className="font-sub-heading">
							"For they too are gatherers of fruit and frankincense, and that which they bring, though fashioned of dreams, is raiment and food for your soul."
						</div>
						<br/>
						<div className="pay-trigger">
							<span className="font-heading btn">Pay As Much As You Wish</span>
							<i className="fa fa-question-circle-o"></i>
						</div>
						<div className="font-sub-heading">
							91% of what you pay goes to the artist(s)
						</div>
					</div>
				</div>
				<div className="share">
					<div className="content">
						<br/><br/>
						<div className="font-sub-heading">
							or
						</div>
						<br/><br/>
						<div>
							<span className="font-heading btn" onClick={this.toggleShare}>Simply Share</span>
						</div>
						<br/>
						<div className={this.state.shareClass}>
							<a href="https://twitter.com/intent/tweet?button_hashtag=LoveTwitter&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">
								<i className="fa fa-twitter"></i>&nbsp;
								{this.props.data.hashtag}
							</a>
						</div>
						<br/>
						<div className={this.state.shareClass}>
							<a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse">
								<i className="fa fa-facebook"></i>&nbsp;
								Share
							</a>
						</div>


					</div>

				</div>
			</div>
		);
	}

}

export default TheEnd;