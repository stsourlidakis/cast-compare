import React, { Component } from 'react';
import { personAutocomplete, theMovieDB } from '../../axios';

import styles from './PersonCompare.module.css';
import Autocomplete from '../../components/UI/Autocomplete/Autocomplete';
import Person from '../../components/Person/Person';
import Credits from '../../components/Person/Credits/Credits';

class PersonCompare extends Component {
	state = {
		people: [],
		autocompleteData: [],
		autocompleteNames: [],
		commonCredits: [],
		commonShowsCounter: 0,
		commonMoviesCounter: 0
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

					const isActor = res.data.known_for_department ==='Acting';
					const relevantCredits = res.data.combined_credits[isActor ? 'cast' : 'crew'];

					const uniqueCredits = relevantCredits.reduce((unique, credit) => {
						if(!unique.find(c => c.id===credit.id)){
							unique.push(credit);
						}
						return unique;
					}, []);

					const sortedCredits = uniqueCredits.sort((a, b) => {
						if(this.isCreditTalkShow(a)){	//move talkshows and documentaries at the end
							return 1;
						} else if(this.isCreditTalkShow(b)){
							return -1;
						} else {
							return b.popularity - a.popularity;
						}
					});

					res.data.credits = sortedCredits;

					newPeople.push(res.data);
					this.setState({ people: newPeople}, this.updateCommonCredits);

					e.target.value = '';
				})
				.catch(err => {
					this.setState({ error: err.response.statusText });
					console.log( err.response.data['status_message'] );
				});
		}
	}

	updateCommonCredits = () => {
		if(this.state.people.length<2){
			this.setState({
				commonCredits: []
			});
			return;
		}

		//	In order to find the common credits we will check if the credits from
		//	the person with the least of them are present in every person's credit list

		//	get only the credit lists and sort them in asc order so the first one has the least number of credits
		const creditLists = this.state.people.map(p => p.credits).sort((a, b) => a.length>b.length);
		const numberOfLists = creditLists.length;
		let commonCredits = [];
		let commonShowsCounter = 0;
		let commonMoviesCounter = 0;
		//	check if each credit in the first's person list are inside the other lists
		creditLists[0].forEach(credit => {
			let isCommon = true;

			for(let i=1; i<numberOfLists; i++){
				if(!this.creditInCreditList(credit, creditLists[i])){
					isCommon = false;
					break;
				}
			}

			if(isCommon){
				commonCredits.push(credit);

				if(credit.media_type==='tv'){
					commonShowsCounter++;
				} else {
					commonMoviesCounter++;
				}
			}
		});

		this.setState({
			commonCredits,
			commonShowsCounter,
			commonMoviesCounter
		});
	}

	//last part to match empty strings that are returned from the API
	isCreditTalkShow = (credit) => /himself|herself|narrator|^$/i.test(credit.character);

	creditInCreditList = (credit, list) => {
		for(const c of list){
			if (c.id === credit.id){
				return true;
			}
		}

		return false;
	}

	removePerson = (personIndex) => {
		const newPeople = this.state.people.slice();
		newPeople.splice(personIndex, 1);
		this.setState({ people: newPeople }, this.updateCommonCredits);
	}

	render () {
		let helpText = "Select two or more people";
		let commonCredits = null;
		if(this.state.people.length>1){
			if(this.state.commonCredits.length>0){
				if(this.state.commonMoviesCounter>0 && this.state.commonShowsCounter>0){
					helpText = `Common Movies(${this.state.commonMoviesCounter}) and TV shows(${this.state.commonShowsCounter}):`;
				} else if(this.state.commonMoviesCounter>0){
					helpText = `Common Movies(${this.state.commonMoviesCounter}):`;
				} else {
					helpText = `Common TV shows(${this.state.commonShowsCounter}):`;
				}
				
				commonCredits = <div className={styles.commonCreditsWrapper}>
									<Credits credits={this.state.commonCredits} displayType="row" expanded />
								</div>;
			} else {
				helpText = "No common Movies or TV shows found";
			}
		}
		return (
			<div className={styles.PersonCompare}>
				<div className={styles.autocompleteWrapper}>
					<Autocomplete
						matches={this.state.autocompleteNames}
						change={this.searchChange}
						select={this.searchSelect}
						focused={true} />
				</div>
				<div className={styles.helpText}>{helpText}</div>
				{commonCredits}
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
