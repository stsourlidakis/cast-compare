import React, { Component } from 'react';
import { personAutocomplete, theMovieDB } from '../../axios';

import styles from './PersonCompare.module.css';
import Autocomplete from '../../components/UI/Autocomplete/Autocomplete';
import Person from '../../components/Person/Person';

class PersonCompare extends Component {
	state = {
		people: [],
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
					const newPeople = this.state.people.slice();

					const sortedCredits = res.data.combined_credits.cast.sort((a, b) => a.popularity < b.popularity);
					res.data.credits = sortedCredits;
					
					newPeople.push(res.data);
					this.setState({
						people: newPeople
					});

					e.target.value = '';
				})
				.catch(err => {
					this.setState({ error: err.response.statusText });
					console.log( err.response.data['status_message'] );
				});
		}
	}

	removePerson = (personIndex) => {
		const newPeople = this.state.people.slice();
		newPeople.splice(personIndex, 1);
		this.setState({
			people: newPeople
		});
	}

	render () {
		return (
			<div className={styles.PersonCompare}>
				<Autocomplete 
					matches={this.state.autocompleteNames}
					change={this.searchChange} 
					select={this.searchSelect} />
				<div className={styles.People}>
					{this.state.people.map((person, i) =>
						<Person
							key={i}
							data={person}
							remove={() => this.removePerson(i)} />
					)}
				</div>
			</div>
		);
	}
}

export default PersonCompare;
