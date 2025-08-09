import React, { Component } from 'react';
import { flushSync } from 'react-dom';
import ReactGA from 'react-ga4';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { personAutocomplete, theMovieDB } from '../../axios';

import styles from './PeopleComparison.module.css';
import Autocomplete from '../../components/UI/Autocomplete/Autocomplete';
import ComparedItem from '../../components/ComparedItem/ComparedItem';
import Credits from '../../components/ComparedItem/Credits/Credits';

class PeopleComparison extends Component {
	state = {
		people: [],
		pendingPeople: [],
		autocompleteData: [],
		autocompleteNames: [],
		commonCredits: [],
		commonShowsCounter: 0,
		commonMoviesCounter: 0
	}

	componentDidMount = () => {
		this._isMounted = true;

		if(this.props.params.ids){
			const ids = this.props.params.ids.split(',');
			ids.forEach(this.getPersonData);
		}
		const bodyEl = document.querySelector('body');
		bodyEl.className = '';
		bodyEl.classList.add('people');
		ReactGA.send({ hitType: "pageview", page: this.props.location.pathname});
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	searchChange = (e) => {
		const searchValue = e.target.value;
		if(searchValue.length>0){
			personAutocomplete.get(`/?name=${searchValue}`)
				.then(res =>{
					if(!this._isMounted)return;

					this.setState({
						autocompleteData: res.data,
						autocompleteNames: res.data.map(match => match.name)
					});
				})
				.catch(err => {
					if(!this._isMounted)return;

					this.setState({ error: err.response.statusText });
					console.log( err.response.data.error );
				});
		}
	}

	searchSelect = (e) => {
		const person = this.state.autocompleteData.find(person => person.name===e.target.value);
		if(person && person.id){
			this.getPersonData(person.id);
			e.target.value = '';

			ReactGA.event({
				category: 'Person',
				action: 'add',
				value: parseInt(person.id),
				label: person.name
			});
		}
	}

	getPersonData = (personId) => {
		this.addPendingPerson(personId);

		theMovieDB.get(`/person/${personId}?append_to_response=combined_credits`)
			.then(res =>{
				if(!this._isMounted)return;

				flushSync(() => {
					const newPeople = this.state.people.slice();
					const newPerson = this.createNewPerson(res.data);
					newPeople.push(newPerson);

					this.removePendingPerson(personId);

					this.setState({ people: newPeople }, () => {
						this.updateCommonCredits();
						this.updateUrl();
					});
				});
			})
			.catch(err => {
				if(!this._isMounted)return;

				this.removePendingPerson(personId);

				this.setState({ error: err.response.statusText });
				console.log( err.response.data );
			});
	}

	createNewPerson = (person) => {
		const personData = this.extractPersonData(person);
		const credits = this.extractCredits(person);
		return {
			...personData,
			credits
		}
	}

	extractPersonData = (person) => ({
		type: 'person',
		imagePath: person.profile_path,
		imdbId: person.imdb_id,
		dateTitle: 'Born',
		date: person.birthday,
		name: person.name,
		id: person.id
	})

	extractCredits = (person) => {
		const isActor = person.known_for_department ==='Acting';
		const relevantCredits = person.combined_credits[isActor ? 'cast' : 'crew'];

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

		return sortedCredits.map(credit => ({
			id: credit.id,
			type: credit.media_type,
			title: credit.media_type==='tv' ? credit.name : credit.title,
			subtitle: credit.release_date ? `(${credit.release_date})` : '',
			imagePath: credit.poster_path
		}));
	}

	addPendingPerson = (personId) => {		
		const newPendingPeople = this.state.pendingPeople.slice();
		newPendingPeople.push({id: personId});
		this.setState({pendingPeople: newPendingPeople});
	}

	removePendingPerson = (personId) => {
		const newPendingPeople = this.state.pendingPeople.slice()
									.filter(person => person.id!==personId);
		this.setState({pendingPeople: newPendingPeople});
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

				if(credit.type==='tv'){
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

	updateUrl = () => {
		const ids = this.state.people.map(person => person.id);
		this.props.navigate('/people/'+ids.join(','));
	}

	//last part to match empty strings that are returned from the API
	isCreditTalkShow = (credit) => /himself|herself|narrator|^$/i.test(credit.character)

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
		const removedPerson = newPeople.splice(personIndex, 1);
		this.setState({ people: newPeople }, () => {
			this.updateCommonCredits();
			this.updateUrl();
		});

		ReactGA.event({
			category: 'Person',
			action: 'remove',
			value: parseInt(removedPerson[0].id),
			label: removedPerson[0].name
		});
	}

	render () {
		let helpText = <>Select two or more <span className={styles.highlighted}>People</span></>;

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
			<div className={styles.PeopleComparison}>
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
						<ComparedItem
							key={i}
							data={person}
							remove={() => this.removePerson(i)} />
					)}
					{this.state.pendingPeople.map(person =>
						<ComparedItem
							key={person.id}
							loading />
					)}
				</div>
			</div>
		);
	}
}

// Wrapper to provide React Router v6 hooks to class component
const PeopleComparisonWrapper = () => {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	
	return (
		<PeopleComparison 
			params={params} 
			navigate={navigate} 
			location={location} 
		/>
	);
};

export default PeopleComparisonWrapper;
