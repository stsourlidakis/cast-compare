import React, { Component } from 'react';
import ReactGA from 'react-ga';

import styles from './Credits.module.css';
import Credit from './Credit/Credit';

class Credits extends Component {
	DEFAULT_CREDITS_LIMIT = 6;

	state = {
		creditsLimited: !this.props.expanded,
		creditsLimit: this.DEFAULT_CREDITS_LIMIT
	}

	showMore = () => {
		this.setState({
			creditsLimit: this.props.credits.length,
			creditsLimited: false
		});

		ReactGA.event({
			category: 'Credits',
			action: 'show'
		});
	}

	showLess = () => {
		this.setState({
			creditsLimit: this.DEFAULT_CREDITS_LIMIT,
			creditsLimited: true
		});

		ReactGA.event({
			category: 'Credits',
			action: 'hide'
		});
	}

	render() {
		let toggleLimitButton = null;
		if(!this.props.expanded){
			if(!this.state.creditsLimited){
				toggleLimitButton = <button onClick={this.showLess}>Less..</button>;
			} else if(this.props.credits.length>this.state.creditsLimit){
				toggleLimitButton = <button onClick={this.showMore}>More..</button>;
			}
		}

		const credits = this.props.expanded
						? this.props.credits
						: this.props.credits.slice(0, this.state.creditsLimit);

		return (
			<>
				<div className={this.props.displayType==='row' ? styles.row : styles.grid}>
					{credits.map( (c, i) =>
						<Credit data={c} key={i} />
					)}
				</div>
				<div className={styles.buttonWrapper}>
					{toggleLimitButton}
				</div>
			</>
		);
	}
}

export default Credits;
