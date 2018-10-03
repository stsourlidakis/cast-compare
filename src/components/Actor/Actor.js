import React from 'react';

import styles from './Actor.module.css';
import ActorPreview from './ActorPreview/ActorPreview';
import Autocomplete from '../UI/Autocomplete/Autocomplete';

const Actor = (props) => {
	return (
		<div className={styles.Actor}>
			<Autocomplete 
				matches={props.matches}
				change={props.autocompleteChange} 
				select={props.autocompleteSelect} />
			<ActorPreview actor={props.data} />
		</div>
	);
};

export default Actor;
