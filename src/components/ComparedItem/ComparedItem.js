import React from 'react';

import styles from './ComparedItem.module.css';
import Card from '../UI/Card/Card';
import ComparedItemPreview from './ComparedItemPreview/ComparedItemPreview';
import Credits from './Credits/Credits';

const ComparedItem = (props) => {
	return (
		<div className={styles.ComparedItem}>
			<Card>
				<ComparedItemPreview person={props.data} remove={props.remove}/>
			</Card>
			<Credits credits={props.data.credits} />
		</div>
	);
};

export default ComparedItem;
