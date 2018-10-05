import React from 'react';

const Credit = (props) => {
	const title = props.data.media_type==='tv' ? props.data.name : props.data.title;
	const released = props.data.release_date ? `(${props.data.release_date})` : '';
	return (
			<a
				href={`https://www.themoviedb.org/movie/${props.data.id}`}
				target="_blank"
				rel="noopener noreferrer">
					<img
						src={`https://image.tmdb.org/t/p/w92/${props.data.poster_path}`}
						alt={title}
						title={`${title} ${released}`} />
			</a>
	);
};

export default Credit;
