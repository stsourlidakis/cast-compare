import React from 'react';

import styles from './ActorPreview.module.css';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const ActorPreview = (props) => {
	return (
		<div className={styles.ActorPreview}>
			<img src={`https://image.tmdb.org/t/p/${imageSize}${props.actor.profile_path}`} alt={props.actor.name} />
			<div className={styles.info}>
				<div className={styles.name}>{props.actor.name}</div>
				<div className={styles.birthday}>Born: {props.actor.birthday}</div>
				<div className={styles.externalLinks}>
					<a className={styles.linkImdb}
						href={`https://www.imdb.com/name/${props.actor.imdb_id}`}
						rel="noopener"
						target="_blank">IMDb</a> 
					<a className={styles.linkMovieDB}
						href={`https://www.themoviedb.org/person/${props.actor.id}`}
						rel="noopener"
						target="_blank">TheMovieDB</a>
				</div>
			</div>
		</div>
	);
};

export default ActorPreview;
