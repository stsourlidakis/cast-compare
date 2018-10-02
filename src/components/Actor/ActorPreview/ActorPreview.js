import React from 'react';

import './ActorPreview.css';

const imageSize = 'w45';	//"w45", "w185", "h632", "original"

const ActorPreview = (props) => {
	return (
		<div className="ActorPreview">
			<img src={`https://image.tmdb.org/t/p/${imageSize}${props.actor.profile_path}`} alt={props.actor.name} />
			<div className="info">
				<div className="name">{props.actor.name}</div>
				<div className="birthday">Born: {props.actor.birthday}</div>
				<div className="externalLinks">
					<a className="linkImdb"
						href={`https://www.imdb.com/name/${props.actor.imdb_id}`}
						rel="noopener"
						target="_blank">IMDb</a> 
					<a className="linkMovieDB"
						href={`https://www.themoviedb.org/person/${props.actor.id}`}
						rel="noopener"
						target="_blank">TheMovieDB</a>
				</div>
			</div>
		</div>
	);
};

export default ActorPreview;
