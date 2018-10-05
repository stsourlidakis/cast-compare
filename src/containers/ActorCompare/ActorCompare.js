import React, { Component } from 'react';
import { personAutocomplete, theMovieDB } from '../../axios';

import styles from './ActorCompare.module.css';
import Autocomplete from '../../components/UI/Autocomplete/Autocomplete';
import Actor from '../../components/Actor/Actor';

class ActorCompare extends Component {
	state = {
		actors: [],
		autocompleteData: [],
		autocompleteNames: []
	}

	searchChange = (e) => {
		const searchValue = e.target.value;
		if(searchValue.length>0){
			personAutocomplete.get(`/?name=${searchValue}`)
				.then(res =>{
					this.setState({
						autocompleteData: res.data,
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
		const person = this.state.autocompleteData.find(person => person.name===e.target.value);
		if(person && person.id){
			theMovieDB.get(`/person/${person.id}?append_to_response=combined_credits`)
				.then(res =>{
					const newActors = this.state.actors.slice();

					const sortedCredits = res.data.combined_credits.cast.sort((a, b) => a.popularity < b.popularity);
					res.data.credits = sortedCredits;
					
					newActors.push(res.data);
					this.setState({
						actors: newActors
					});

					e.target.value = '';
				})
				.catch(err => {
					this.setState({ error: err.response.statusText });
					console.log( err.response.data['status_message'] );
				});
		}
	}

	removeActor = (actorIndex) => {
		const newActors = this.state.actors.slice();
		newActors.splice(actorIndex, 1);
		this.setState({
			actors: newActors
		});
	}

	render () {
		return (
			<div className={styles.ActorCompare}>
				<Autocomplete 
					matches={this.state.autocompleteNames}
					change={this.searchChange} 
					select={this.searchSelect} />
				<div className={styles.Actors}>
					{this.state.actors.map((actor, i) =>
						<Actor
							key={i}
							data={actor}
							remove={() => this.removeActor(i)} />
					)}
				</div>
			</div>
		);
	}
}

export default ActorCompare;
