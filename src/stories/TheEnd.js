import React, { Component } from 'react';

class TheEnd extends Component {

	constructor(props){
		super(props);
	}

	render(){

		return(
			<div className={"part the-end "+this.props.activeClass}>
				<div className="credits">
					<div className="content">
						<div className="font-sub-heading">this story was brought to you by</div>
						<div className="font-heading">Kavya Srinivasan</div>
					</div>
				</div>
				<div className="payment">
					<div className="content">
						<div className="font-sub-heading">
							"And if there come the singers and the dancers and the flute players, buy of their gifts also.<br/>
							For they too are gatherers of fruit and frankincense, and that which they bring, though fashioned of dreams, is raiment and food for your soul."
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
							<span className="font-heading btn">Simply Share</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default TheEnd;