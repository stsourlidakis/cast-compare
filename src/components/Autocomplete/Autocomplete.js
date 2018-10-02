import React from 'react';

import styles from './Autocomplete.module.css';

const Autocomplete = (props) => {
	const datalistKey = `autocomplete-${~~(Math.random()*1000)}`;

	return (
		<div className={styles.Autocomplete}>
			<input type="text" list={datalistKey} onChange={props.change} />
			<datalist id={datalistKey}>
				{props.matches.map((match, index) => <option value={match} key={index} />)}
			</datalist>
		</div>
	);
};

export default Autocomplete;
