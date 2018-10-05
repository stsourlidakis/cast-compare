import React from 'react';

import styles from './ActorPreview.module.css';
import missing from '../../../assets/images/missingPhoto.svg';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const ActorPreview = (props) => {
	let imageSrc = missing;
	if(props.actor.profile_path){
		imageSrc = `https://image.tmdb.org/t/p/${imageSize}${props.actor.profile_path}`;
	}

	let imdbButton = null;
	if(props.actor.imdb_id){
		imdbButton = <a
			className="externalLink linkImdb"
			href={`https://www.imdb.com/name/${props.actor.imdb_id}`}
			rel="noopener noreferrer"
			target="_blank">IMDb</a>;
	}

	let birthday = null;
	if(props.actor.birthday){
		birthday = <div className={styles.birthday}>Born: {props.actor.birthday}</div>;
	}

	return (
		<div className={styles.ActorPreview}>
			<img src={imageSrc} alt={props.actor.name} width="45" height="auto" />
			<div className={styles.info}>
				<button className={styles.remove} onClick={props.remove}>X</button>
				<div className={styles.name}>{props.actor.name}</div>
				{birthday}
				<div className={styles.externalLinks}>
					{imdbButton}
					<a className="externalLink linkMovieDB"
						href={`https://www.themoviedb.org/person/${props.actor.id}`}
						rel="noopener noreferrer"
						target="_blank">TheMovieDB</a>
				</div>
			</div>
		</div>
	);
};

export default ActorPreview;
