import React from 'react';

import styles from './ComparedItemPreview.module.css';
import missing from '../../../assets/images/missingPhoto.svg';
import TmdbLink from '../../TmdbLink/TmdbLink';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const ComparedItemPreview = (props) => {
	let imageSrc = missing;
	if(props.person.imagePath){
		imageSrc = `https://image.tmdb.org/t/p/${imageSize}${props.person.imagePath}`;
	}

	let imdbButton = null;
	if(props.person.imdbId){
		const imdbType = props.person.type==='person' ? 'name' :'title';
		imdbButton = <a
			className="externalLink linkImdb"
			href={`https://www.imdb.com/${imdbType}/${props.person.imdbId}`}
			rel="noopener noreferrer"
			target="_blank">IMDb</a>;
	}

	let date = null;
	if(props.person.date){
		date = <div className={styles.date}>{props.person.dateTitle}: {props.person.date}</div>;
	}

	return (
		<div className={styles.ComparedItemPreview}>
			<img src={imageSrc} alt={props.person.name} width="45" height="auto" />
			<div className={styles.info}>
				<button className={styles.remove} onClick={props.remove}>X</button>
				<div className={styles.name}>{props.person.name}</div>
				{date}
				<div className={styles.externalLinks}>
					{imdbButton}
					<TmdbLink
						type={props.person.type}
						id={props.person.id}
						classes="externalLink linkMovieDB">TheMovieDB</TmdbLink>
				</div>
			</div>
		</div>
	);
};

export default ComparedItemPreview;
