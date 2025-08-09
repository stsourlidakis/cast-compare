import React, { Component } from 'react';
import awesomplete from 'awesomplete';
import 'awesomplete/awesomplete.css';

import styles from './Autocomplete.module.css';

class Autocomplete extends Component {
	awesompleteInstance = null;
	inputRef = React.createRef();
	awesompleteOptions = {
		autoFirst: true,
		sort: false,	//items are already sorted by number of votes on imdb
		minChars: 1,
		filter: () => true	//no need to filter them, they are all matches
	}

	componentDidMount = () => {
		this.awesompleteInstance = new awesomplete(this.inputRef.current, this.awesompleteOptions);
		this.inputRef.current.addEventListener('awesomplete-selectcomplete', this.props.select);
		
		if(this.props.focused){
			this.inputRef.current.focus();
		}
	}

	componentWillUnmount = () => {
		this.inputRef.current.removeEventListener('awesomplete-selectcomplete', this.props.select);
	}

	componentDidUpdate = (prevProps) => {
		if(this.props.matches !== prevProps.matches){
			this.awesompleteInstance.list = this.props.matches;
		}
	}

	render() {
		return (
			<div className={styles.Autocomplete}>
				<input
					type="text"
					placeholder={this.props.placeholder || "Start typing a name.."}
					ref={this.inputRef}
					onChange={this.props.change} />
			</div>
		);
	}
}

export default Autocomplete;