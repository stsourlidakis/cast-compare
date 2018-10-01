import React from 'react';

import './Actor.css';
import ActorPreview from './ActorPreview/ActorPreview';

const Actor = (props) => {
	return (
		<div className="Actor">
			<ActorPreview actor={props.data} />
		</div>
	);
};

export default Actor;
