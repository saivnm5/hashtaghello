import React, { Component } from 'react';
import { getShareUrl } from '../utils/simpl';
import axios from 'axios';

class TheEnd extends Component {

	constructor(props){
		super(props);
		this.state = {
			shareClass: 'hide',
			paymentOn: false,
			shareUrl: getShareUrl(this.props.data.slug),
			paymentAmount: null,
			paymentName: null,
			paymentBtnText: 'Proceed To Pay'
		};
	}

	handleAmountChange = (event) => {
		this.setState({
			paymentAmount: parseInt(event.target.value,10)
		});
	}

	handleNameChange = (event) => {
		this.setState({
			paymentName: event.target.value
		});
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

	redirectToPayment = () => {
		var comp = this;
		this.setState({
			paymentBtnText: 'Redirecting...',
			paymentOn: true
		});
		var apiRoot = localStorage.getItem('apiRoot');

    var data = {
      query: "mutation ($input: PaymentInput) { \n getPaymentLink(input: $input) \n }",
      variables: {
        input:{
          storySlug: this.props.data.storySlug,
          amount: this.state.paymentAmount,
          buyerName: this.state.paymentName
        }
      }
    };

    axios({
      method: 'post',
      url: apiRoot+'/public',
      data: data
    }).then(function(response){
        var link = response.data.data.getPaymentLink;
        window.location = link;
    }).catch(function(error){
    	comp.setState({
      	paymentBtnText: 'Proceed To Pay'
      });
    });
	}

	render(){
		var content = null;
		var showPaymentClass = 'hide';
		var showShareClass = 'show';
		if(!this.props.data.isPrivate && this.props.data.allowPayment){
			showPaymentClass = 'show';
		}
		else if(this.props.data.isPrivate){
			showShareClass = 'hide';
		}


		if(!this.state.paymentOn){
			content = (
			<div className="the-end">
				<div className="credits">
					<div className="content">
						<div className="font-sub-heading">this story was brought to you by</div>
						<div className="font-heading">{'#'+this.props.data.createdByName}</div>
					</div>
				</div>
				<div className={"payment "+showPaymentClass}>
					<div className="content">
						<div className="font-sub-heading">
							For the storytellers "too are gatherers of fruit and frankincense, and that which they bring, though fashioned of dreams, is raiment and food for your soul."
						</div>
						<br/>
						<div className="pay-trigger">
							<span className="font-heading btn" onClick={this.triggerPayment}>Pay As Much As You Wish</span>
						</div>
						<div className="font-sub-heading">
							91% of what you pay goes to the artist(s)
						</div>
					</div>
				</div>
				<div className={"share "+showShareClass}>
					<div className="content">

						<div className={"font-sub-heading "+showPaymentClass}>
							<br/><br/>
							or
							<br/><br/>
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
									<input
										type="number"
										className="form"
										placeholder="₹"
										value={this.state.paymentAmount}
										onChange={this.handleAmountChange}
									/>
								</div>
							</div>
							<br/>

							<div>
								<div className="form-label">
									<div className="right-align">from:&nbsp;</div>
								</div>
								<div>
									<input
										type="text"
										className="form"
										placeholder="(your name)"
										value={this.state.paymentName}
										onChange={this.handleNameChange}
									/>
								</div>
							</div>
							<br/><br/><br/>

							<div>
									<span className="font-heading btn" onClick={this.redirectToPayment}>
										{this.state.paymentBtnText}
									</span>
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