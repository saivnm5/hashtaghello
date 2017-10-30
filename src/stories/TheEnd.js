import React, { Component } from 'react';
import { getShareUrl } from '../utils/simpl';

class TheEnd extends Component {

	constructor(props){
		super(props);
		this.state = {
			shareClass: 'hide',
			paymentOn: false,
			shareUrl: getShareUrl(this.props.data.slug)
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

	triggerPayment = () => {
		this.setState({
			paymentOn: true
		});
	}

	render(){
		var content = null;
		if(!this.state.paymentOn){
			content = (
			<div className="the-end">
				<div className="credits">
					<div className="content">
						<div className="font-sub-heading">this story was brought to you by</div>
						<div className="font-heading">{'#'+this.props.data.createdByName}</div>
					</div>
				</div>
				<div className="payment hide">
					<div className="content">
						<div className="font-sub-heading">
							For the storytellers "too are gatherers of fruit and frankincense, and that which they bring, though fashioned of dreams, is raiment and food for your soul."
						</div>
						<br/>
						<div className="pay-trigger">
							<span className="font-heading btn" onClick={this.triggerPayment}>Pay As Much As You Wish</span>
							<i className="fa fa-question-circle-o"></i>
						</div>
						<div className="font-sub-heading">
							91% of what you pay goes to the artist(s)
						</div>
					</div>
				</div>
				<div className="share">
					<div className="content">

						<div className="font-sub-heading hide">
							or
						</div>

						<div>
							<span className="font-heading btn" onClick={this.toggleShare}>Share</span>
						</div>
						<br/>

						<div className={this.state.shareClass}>
							<a target="_blank" href={"https://twitter.com/intent/tweet?button_hashtag="+this.props.data.hashtag.replace(/^#/, '')+"&url="+this.state.shareUrl} rel="noopener noreferrer">
								<i className="fa fa-twitter"></i>&nbsp;
								{this.props.data.hashtag}
							</a>
						</div>
						<br/>

						<div className={this.state.shareClass}>
							<a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u="+this.state.shareUrl} rel="noopener noreferrer">
								<i className="fa fa-facebook"></i>&nbsp;
								Share
							</a>
						</div>

					</div>
				</div>
			</div>
			);
		}
		else{
			content = (
				<div className="the-end">
					<div className="payment-form">
						<div className="content">

							<div>
								<div>
									<div className="font-sub-heading right-align">pay to&nbsp;&nbsp;</div>
								</div>
								<div>
									<span className="font-heading">{'#'+this.props.data.createdByName}</span>
								</div>
							</div>
							<br/>

							<div>
								<div>
									<div className="font-sub-heading right-align">for the story&nbsp;&nbsp;</div>
								</div>
								<div>
									<span className="font-heading">{this.props.data.hashtag}</span>
								</div>
							</div>
							<br/>

							<div>
								<div className="form-label">
									<div className="right-align">an amount of :&nbsp;</div>
								</div>
								<div>
									<input type="text" className="form" placeholder="(plz enter)" />
								</div>
							</div>
							<br/>

							<div>
								<div className="form-label">
									<div className="right-align">from:&nbsp;</div>
								</div>
								<div>
									<input type="text" className="form" placeholder="anonymous" />
								</div>
							</div>
							<br/><br/><br/>

							<div>
									<span className="font-heading btn">Proceed To Pay</span>
							</div>

						</div>
					</div>
				</div>
			);
		}

		return(
			<div className={"part "+this.props.activeClass}>
				{content}
			</div>
		);
	}

}

export default TheEnd;