import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Menu.module.css';
 
const Menu = (props) => {
	return (
		<div className={styles.Menu}>
			<Link to="/movies" className={styles.link}>Compare Movies</Link>
			<Link to="/people" className={styles.link}>Compare People</Link>
		</div>
	);
};

export default Menu;
