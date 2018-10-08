import React from 'react';

import missing from '../../../../assets/images/missingPoster.png';
import styles from './Credit.module.css';


const Credit = (props) => {
	const title = props.data.media_type==='tv' ? props.data.name : props.data.title;
	const released = props.data.release_date ? `(${props.data.release_date})` : '';
	const imgSrc = props.data.poster_path ? `https://image.tmdb.org/t/p/w92/${props.data.poster_path}` : missing;
	return (
		<a
			className={styles.Credit}
			href={`https://www.themoviedb.org/movie/${props.data.id}`}
			target="_blank"
			rel="noopener noreferrer">
				<img
					src={imgSrc}
					alt={title}
					title={`${title} ${released}`} />
		</a>
	);
};

export default Credit;
