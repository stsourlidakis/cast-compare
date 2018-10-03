import React, { Component } from 'react';
import awesomplete from 'awesomplete';
import 'awesomplete/awesomplete.css';

import styles from './Autocomplete.module.css';

class Autocomplete extends Component {
	awesompleteInstance = null;
	inputElement = null;
	autocompleteId = `autocomplete-${~~(Math.random()*1000)}`;
	awesompleteOptions = {
		autoFirst: true,
		sort: false,	//items are already sorted by number of votes on imdb
		minChars: 1,
		filter: () => true	//no need to filter them, they are all matches
	}

	componentDidMount = () => {
		this.inputElement = document.getElementById(this.autocompleteId);
		this.awesompleteInstance = new awesomplete(this.inputElement, this.awesompleteOptions);
		this.inputElement.addEventListener('awesomplete-selectcomplete', this.props.select);
	}

	componentWillUnmount = () => {
		this.inputElement.removeEventListener('awesomplete-selectcomplete', this.props.select);
	}

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.matches!==this.props.matches){
			this.awesompleteInstance.list = nextProps.matches;
		}
	}

	render() {
		return (
			<div className={styles.Autocomplete}>
				<input
					type="text"
					placeholder="Start typing a name.."
					id={this.autocompleteId}
					onChange={this.props.change} />
			</div>
		);
	}
}

export default Autocomplete;