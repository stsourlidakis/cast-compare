import React from 'react';

import styles from './Person.module.css';
import Card from '../UI/Card/Card';
import PersonPreview from './PersonPreview/PersonPreview';
import Credits from './Credits/Credits';

const Person = (props) => {
	return (
		<div className={styles.Person}>
			<Card>
				<PersonPreview person={props.data} remove={props.remove}/>
			</Card>
			<Credits credits={props.data.credits} personId={props.data.id} />
		</div>
	);
};

export default Person;
