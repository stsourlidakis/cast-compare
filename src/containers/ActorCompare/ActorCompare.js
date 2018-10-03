import React, { Component } from 'react';
import { personAutocomplete } from '../../axios';

import styles from './ActorCompare.module.css';
import Actor from '../../components/Actor/Actor';

const dummyData = [{
		"birthday": "1958-10-16",
		"known_for_department": "Acting",
		"deathday": null,
		"id": 504,
		"name": "Tim Robbins",
		"also_known_as": [],
		"gender": 2,
		"biography": "​Timothy Francis \"Tim\" Robbins (born October 16, 1958) is an American actor, screenwriter, director, producer, activist and musician. He is the former longtime partner of actress Susan Sarandon. He is known for his roles as Nuke in Bull Durham, Andy Dufresne in The Shawshank Redemption, and as Dave Boyle in Mystic River, for which he won an Academy Award for Best Supporting Actor.\n\nDescription above from the Wikipedia article Tim Robbins, licensed under CC-BY-SA, full list of contributors on Wikipedia.",
		"popularity": 3.677,
		"place_of_birth": "West Covina, California, USA",
		"profile_path": "/7pirFsBQe93TSfzu404Hgcj1YWj.jpg",
		"adult": false,
		"imdb_id": "nm0000209",
		"homepage": null
}, {
		"birthday": "1962-07-03",
		"known_for_department": "Acting",
		"deathday": null,
		"id": 500,
		"name": "Tom Cruise",
		"also_known_as": [
		"Том Круз",
		"トム・クルーズ",
		"ทอม ครูซ",
		"湯姆·克魯斯",
		"톰 크루즈",
		"توم كروز",
		"Thomas Cruise Mapother IV"
		],
		"gender": 2,
		"biography": "Thomas \"Tom\" Cruise (born Thomas Cruise Mapother IV; July 3, 1962) is an American actor and filmmaker. He has been nominated for three Academy Awards and has won three Golden Globe Awards.\n\nHe started his career at age 19 in the 1981 film Endless Love. After portraying supporting roles in Taps (1981) and The Outsiders (1983), his first leading role was in Risky Business, released in August 1983. Cruise became a full-fledged movie star after starring as Pete \"Maverick\" Mitchell in Top Gun (1986). He has since 1996 been well known for his role as secret agent Ethan Hunt in the Mission: Impossible film series. One of the biggest movie stars in Hollywood, Cruise has starred in many successful films, including The Color of Money (1986), Cocktail (1988), Rain Man (1988), Born on the Fourth of July (1989), Far and Away(1992), A Few Good Men (1992), The Firm (1993), Interview with the Vampire: The Vampire Chronicles (1994), Jerry Maguire (1996), Eyes Wide Shut (1999), Magnolia (1999), Vanilla Sky (2001), Minority Report (2002),The Last Samurai (2003), Collateral (2004), War of the Worlds (2005), Lions for Lambs (2007), Valkyrie (2008), Knight and Day (2010), Jack Reacher (2012), Oblivion (2013), and Edge of Tomorrow (2014).\n\nIn 2012, Cruise was Hollywood's highest-paid actor. Fifteen of his films grossed over $100 million domestically; twenty-one have grossed in excess of $200 million worldwide. Cruise is known for his support for the Church of Scientology and its affiliated social programs.",
		"popularity": 19.065,
		"place_of_birth": "Syracuse, New York, USA",
		"profile_path": "/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg",
		"adult": false,
		"imdb_id": "nm0000129",
		"homepage": "http://www.tomcruise.com/"
}];

class ActorCompare extends Component {
	state = {
		matches: [],
		autocompleteNames: []
	}

	searchChange = (e) => {
		const searchValue = e.target.value;
		if(searchValue.length>0){
			personAutocomplete.get(`/?name=${searchValue}`)
				.then(res =>{
					this.setState({
						matches: res.data,
						autocompleteNames: res.data.map(match => match.name)
					});
				})
				.catch(err => {
					this.setState({ error: err.response.statusText });
					console.log( err.response.data.error );
				});
		}
	}

	searchSelect = (e) => {
		//get the actor data
		const person = this.state.matches.find(match => match.name===e.target.value);
		console.log('Person selected: ', person);
	}

	render () {
		return (
			<div className={styles.ActorCompare}>
				<Actor
					data={dummyData[0]}
					matches={this.state.autocompleteNames} 
					autocompleteChange={this.searchChange}
					autocompleteSelect={this.searchSelect} />
				<Actor
					data={dummyData[1]}
					matches={this.state.autocompleteNames} 
					autocompleteChange={this.searchChange}
					autocompleteSelect={this.searchSelect} />
			</div>
		);
	}
}

export default ActorCompare;
