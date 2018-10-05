import React, { Component } from 'react';

import styles from './Credits.module.css';

class Credits extends Component {
	DEFAULT_CREDITS_LIMIT = 5;

	state = {
		creditsLimited: true,
		creditsLimit: this.DEFAULT_CREDITS_LIMIT
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
			<div className={styles.Credits}>
				{this.props.credits.slice(0, this.state.creditsLimit).map( (c, i) =>
					<div key={i}>{c.media_type==='tv' ? c.name : c.title}</div>
				)}
				{toggleLimitButton}
			</div>
		);
	}
}

export default Credits;
