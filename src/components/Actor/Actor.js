import React from 'react';

import styles from './Actor.module.css';
import ActorPreview from './ActorPreview/ActorPreview';
import Autocomplete from '../UI/Autocomplete/Autocomplete';
import missing from '../../assets/images/missingPhoto.svg';

const Actor = (props) => {
	let preview = 
		<div className={styles.missing}>
			<img src={missing} alt="No person selected" width="65" height="auto"/>
		</div>;
	if(props.data){
		preview = <ActorPreview actor={props.data} />;
	}
	return (
		<div className={styles.Actor}>
			<Autocomplete 
				matches={props.matches}
				change={props.autocompleteChange} 
				select={props.autocompleteSelect} />
			{preview}
		</div>
	);
};

export default Actor;
