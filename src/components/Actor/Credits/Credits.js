import React, { Component } from 'react';

class Credits extends Component {
	DEFAULT_CREDITS_LIMIT = 5;

	state = {
		actorId: this.props.actorId,
		creditsLimited: true,
		creditsLimit: this.DEFAULT_CREDITS_LIMIT
	}

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.actorId!==this.state.actorId){
			//update the actorId and reset the credits filter
			this.setState({
				actorId: nextProps.actorId,
				creditsLimited: true,
				creditsLimit: this.DEFAULT_CREDITS_LIMIT
			});
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return nextProps.actorId!==this.state.actorId || nextState!==this.state;
	}

	showMore = () => {
		this.setState({
			creditsLimit: this.props.credits.length,
			creditsLimited: false
		});
	}

	showLess = () => {
		this.setState({
			creditsLimit: this.DEFAULT_CREDITS_LIMIT,
			creditsLimited: true
		});
	}

	render() {
		let toggleLimitButton = null;
		if(!this.state.creditsLimited){
			toggleLimitButton = <button onClick={this.showLess}>Less..</button>;
		} else if(this.props.credits.length>this.state.creditsLimit){
			toggleLimitButton = <button onClick={this.showMore}>More..</button>;
		}

		return (
			<div className="Credits">
				{this.props.credits.slice(0, this.state.creditsLimit).map( (c, i) =>
					<div key={i}>{c.media_type==='tv' ? c.name : c.title}</div>
				)}
				{toggleLimitButton}
			</div>
		);
	}
}

export default Credits;
