import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import styles from './Menu.module.css';
 
const Menu = (props) => {
	const pages = ['movies', 'people'];
	const defaultPage = 'movies';
	let activePage = props.location.pathname.split('/')[1];
	if(activePage===''){	//in case of /
		activePage=defaultPage;
	}

	return (
		<div className={styles.Menu}>
			{pages.map(page =>
				<Link
					to={`/${page}`}
					className={[styles.link, page===activePage ? styles.active : null].join(' ')}
					key={page}>{`Compare ${page}`}</Link>
			)}
		</div>
	);
};

export default withRouter(Menu);
