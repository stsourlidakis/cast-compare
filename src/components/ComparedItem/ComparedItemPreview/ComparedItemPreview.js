import React from 'react';

import styles from './ComparedItemPreview.module.css';
import missing from '../../../assets/images/missingPhoto.svg';
import TmdbLink from '../../TmdbLink/TmdbLink';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const ComparedItemPreview = (props) => {
	let name = props.data.name;
	let nameClass = name.length>17 ? styles.nameSmall : styles.name;
	if(name.length>17){
		nameClass = styles.nameSmall;
		if(name.length>29){
			name = name.slice(0, 27)+'..';
		}
	}

	let imageSrc = missing;
	if(props.data.imagePath){
		imageSrc = `https://image.tmdb.org/t/p/${imageSize}${props.data.imagePath}`;
	}

	let imdbButton = null;
	if(props.data.imdbId){
		const imdbType = props.data.type==='data' ? 'name' :'title';
		imdbButton = <a
			className="externalLink linkImdb"
			href={`https://www.imdb.com/${imdbType}/${props.data.imdbId}`}
			rel="noopener noreferrer"
			target="_blank">IMDb</a>;
	}

	let date = null;
	if(props.data.date){
		date = <div className={styles.date}>{props.data.dateTitle}: {props.data.date}</div>;
	}

	return (
		<div className={styles.ComparedItemPreview}>
			<img src={imageSrc} alt={props.data.name} width="45" height="auto" />
			<div className={styles.info}>
				<button className={styles.remove} onClick={props.remove}>X</button>
				<div className={nameClass} title={props.data.name}>{name}</div>
				{date}
				<div className={styles.externalLinks}>
					{imdbButton}
					<TmdbLink
						type={props.data.type}
						id={props.data.id}
						classes="externalLink linkMovieDB">TheMovieDB</TmdbLink>
				</div>
			</div>
		</div>
	);
};

export default ComparedItemPreview;
