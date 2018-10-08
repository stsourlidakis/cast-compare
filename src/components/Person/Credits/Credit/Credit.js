import React from 'react';

import missing from '../../../../assets/images/missingPoster.png';
import styles from './Credit.module.css';
import TmdbLink from '../../../TmdbLink/TmdbLink';


const Credit = (props) => {
	const title = props.data.media_type==='tv' ? props.data.name : props.data.title;
	const released = props.data.release_date ? `(${props.data.release_date})` : '';
	const imgSrc = props.data.poster_path ? `https://image.tmdb.org/t/p/w92/${props.data.poster_path}` : missing;
	return (
		<TmdbLink type={props.data.media_type} id={props.data.id} >
				<img
					className={styles.Credit}
					src={imgSrc}
					alt={title}
					title={`${title} ${released}`} />
		</TmdbLink>
	);
};

export default Credit;
