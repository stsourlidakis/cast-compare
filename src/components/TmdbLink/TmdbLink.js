import React from 'react';

const TmdbLink = (props) => {
	const baseUrl = 'https://www.themoviedb.org';
	return (
		<a
			href={`${baseUrl}/${props.type}/${props.id}`}
			target="_blank"
			rel="noopener noreferrer"
			className={props.classes}>
			{props.children}
		</a>
	);
};

export default TmdbLink;
