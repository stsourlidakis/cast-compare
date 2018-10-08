import React from 'react';

import styles from './PersonPreview.module.css';
import missing from '../../../assets/images/missingPhoto.svg';
import TmdbLink from '../../TmdbLink/TmdbLink';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const PersonPreview = (props) => {
	let imageSrc = missing;
	if(props.person.profile_path){
		imageSrc = `https://image.tmdb.org/t/p/${imageSize}${props.person.profile_path}`;
	}

	let imdbButton = null;
	if(props.person.imdb_id){
		imdbButton = <a
			className="externalLink linkImdb"
			href={`https://www.imdb.com/name/${props.person.imdb_id}`}
			rel="noopener noreferrer"
			target="_blank">IMDb</a>;
	}

	let birthday = null;
	if(props.person.birthday){
		birthday = <div className={styles.birthday}>Born: {props.person.birthday}</div>;
	}

	return (
		<div className={styles.PersonPreview}>
			<img src={imageSrc} alt={props.person.name} width="45" height="auto" />
			<div className={styles.info}>
				<button className={styles.remove} onClick={props.remove}>X</button>
				<div className={styles.name}>{props.person.name}</div>
				{birthday}
				<div className={styles.externalLinks}>
					{imdbButton}
					<TmdbLink
						type='person'
						id={props.person.id}
						classes="externalLink linkMovieDB">TheMovieDB</TmdbLink>
				</div>
			</div>
		</div>
	);
};

export default PersonPreview;
