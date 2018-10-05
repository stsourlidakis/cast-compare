import React from 'react';

import styles from './Actor.module.css';
import Card from '../UI/Card/Card';
import ActorPreview from './ActorPreview/ActorPreview';
import Credits from './Credits/Credits';

const Actor = (props) => {
	return (
		<div className={styles.Actor}>
			<Card>
				<ActorPreview actor={props.data} remove={props.remove}/>
			</Card>
			<Credits credits={props.data.credits} actorId={props.data.id} />
		</div>
	);
};

export default Actor;
