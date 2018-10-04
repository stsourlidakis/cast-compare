import React, { Component } from 'react';
import { personAutocomplete, theMovieDB } from '../../axios';

import styles from './ActorCompare.module.css';
import Actor from '../../components/Actor/Actor';

class ActorCompare extends Component {
	NUMBER_OF_ACTORS = 2;

	state = {
		actorData: {},
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

	searchSelect = (actorKey, e) => {
		const person = this.state.matches.find(match => match.name===e.target.value);
		if(person && person.id){
			theMovieDB.get(`/person/${person.id}?append_to_response=combined_credits`)
				.then(res =>{
					const sortedCredits = res.data.combined_credits.cast.sort((a, b) => a.popularity < b.popularity);
					delete res.data.combined_credits;
					res.data.credits = sortedCredits;
					
					const newActorData = {...this.state.actorData};
					newActorData[actorKey] = res.data;
					this.setState({
						actorData: newActorData
					});
				})
				.catch(err => {
					this.setState({ error: err.response.statusText });
					console.log( err.response.data['status_message'] );
				});
		}
	}

	render () {
		const actors = [];
		for (let i = 0; i < this.NUMBER_OF_ACTORS; i++) {
			actors.push(
				<Actor
					key={i}
					data={this.state.actorData[`actor${i}`]}
					matches={this.state.autocompleteNames}
					autocompleteChange={this.searchChange}
					autocompleteSelect={(e) => this.searchSelect(`actor${i}`, e) } />
			);
		}

		return (
			<div className={styles.ActorCompare}>
				{actors}
			</div>
		);
	}
}

export default ActorCompare;
