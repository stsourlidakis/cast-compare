import React from 'react';

import styles from './Actor.module.css';
import Card from '../UI/Card/Card';
import ActorPreview from './ActorPreview/ActorPreview';
import Credits from './Credits/Credits';
import Autocomplete from '../UI/Autocomplete/Autocomplete';
import missing from '../../assets/images/missingPhoto.svg';

const Actor = (props) => {
	let preview = 
		<div className={styles.missing}>
			<img src={missing} alt="No person selected" width="65" height="auto"/>
		</div>;
	let credits = null;
	if(props.data){
		preview = <ActorPreview actor={props.data} />;
		credits = <Credits credits={props.data.credits} actorId={props.data.id} />;
	}
	return (
		<div className={styles.Actor}>
			<Card>
				<Autocomplete 
					matches={props.matches}
					change={props.autocompleteChange} 
					select={props.autocompleteSelect} />
				{preview}
			</Card>
			{credits}
		</div>
	);
};

export default Actor;
