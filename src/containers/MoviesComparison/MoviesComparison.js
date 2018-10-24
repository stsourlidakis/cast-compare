import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { movieAutocomplete, theMovieDB } from '../../axios';

import styles from './MoviesComparison.module.css';
import Autocomplete from '../../components/UI/Autocomplete/Autocomplete';
import ComparedItem from '../../components/ComparedItem/ComparedItem';
import Credits from '../../components/ComparedItem/Credits/Credits';

class MoviesComparison extends Component {
	state = {
		movies: [],
		pendingMovies: [],
		autocompleteData: [],
		autocompleteNames: [],
		commonCredits: []
	}

	componentDidMount = () => {
		this._isMounted = true;

		if(this.props.match.params.ids){
			const ids = this.props.match.params.ids.split('/');
			ids.forEach(this.getMovieData);
		}
		const bodyEl = document.querySelector('body');
		bodyEl.className = '';
		bodyEl.classList.add('movies');
		ReactGA.pageview(this.props.match.url);
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	searchChange = (e) => {
		const searchValue = e.target.value;
		if(searchValue.length>0){
			movieAutocomplete.get(`/?name=${searchValue}`)
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
		const movie = this.state.autocompleteData.find(movie => movie.name===e.target.value);
		if(movie && movie.id){
			this.getMovieData(movie.id);
			e.target.value = '';

			ReactGA.event({
				category: 'Movie',
				action: 'add',
				value: parseInt(movie.id),
				label: movie.name
			});
		}
	}

	getMovieData = (movieId) => {
		this.addPendingMovie(movieId);
		
		theMovieDB.get(`/movie/${movieId}?append_to_response=credits`)
			.then(res =>{
				if(!this._isMounted)return;

				const newMovies = this.state.movies.slice();
				const newMovie = this.createNewMovie(res.data);
				newMovies.push(newMovie);

				this.removePendingMovie(movieId);

				this.setState({ movies: newMovies }, () => {
					this.updateCommonCredits();
					this.updateUrl();
				});
			})
			.catch(err => {
				if(!this._isMounted)return;

				this.removePendingMovie(movieId);

				this.setState({ error: err.response.statusText });
				console.log( err.response.data );
			});
	}

	createNewMovie = (movie) => {
		const movieData = this.extractMovieData(movie);
		const credits = this.extractCredits(movie);
		return {
			...movieData,
			credits
		}
	}

	extractMovieData = (movie) => ({
		type: 'movie',
		imagePath: movie.poster_path,
		imdbId: movie.imdb_id,
		dateTitle: 'Released',
		date: movie.release_date,
		name: movie.original_title,
		id: movie.id
	})

	extractCredits = (movie) => {
		const uniqueCredits = movie.credits.cast.reduce((unique, credit) => {
			if(!unique.find(c => c.id===credit.id)){
				unique.push(credit);
			}
			return unique;
		}, []);

		return uniqueCredits.map(person => ({
			id: person.id,
			type: 'person',
			title: person.name,
			subtitle: person.character ? `(${person.character})` : `(${person.job})`,
			imagePath: person.profile_path
		}));
	}

	addPendingMovie = (movieId) => {
		const newPendingMovies = this.state.pendingMovies.slice();
		newPendingMovies.push({id: movieId});
		this.setState({pendingMovies: newPendingMovies});
	}

	removePendingMovie = (movieId) => {
		const newPendingMovies = this.state.pendingMovies.slice()
								.filter(movie => movie.id!==movieId);
		this.setState({pendingMovies: newPendingMovies});
	}

	updateCommonCredits = () => {
		if(this.state.movies.length<2){
			this.setState({
				commonCredits: []
			});
			return;
		}

		//	In order to find the common credits we will check if the credits from
		//	the movie with the least of them are present in every person's credit list

		//	get only the credit lists and sort them in asc order so the first one has the least number of credits
		const creditLists = this.state.movies.map(p => p.credits).sort((a, b) => a.length>b.length);
		const numberOfLists = creditLists.length;
		let commonCredits = [];
		//	check if each credit in the first's movie list are inside the other lists
		creditLists[0].forEach(credit => {
			let isCommon = true;

			for(let i=1; i<numberOfLists; i++){
				if(!this.creditInCreditList(credit, creditLists[i])){
					isCommon = false;
					break;
				}
			}

			if(isCommon){
				commonCredits.push({
					...credit,
					subtitle: ''
				});
			}
		});

		this.setState({
			commonCredits
		});
	}

	updateUrl = () => {
		const ids = this.state.movies.map(movie => movie.id);
		this.props.history.push('/movies/'+ids.join('/'));
	}

	creditInCreditList = (credit, list) => {
		for(const c of list){
			if (c.id === credit.id){
				return true;
			}
		}

		return false;
	}

	removeMovie = (movieIndex) => {
		const newMovies = this.state.movies.slice();
		const removedMovie = newMovies.splice(movieIndex, 1);
		this.setState({ movies: newMovies }, () => {
			this.updateCommonCredits();
			this.updateUrl();
		});

		ReactGA.event({
			category: 'Movie',
			action: 'remove',
			value: parseInt(removedMovie[0].id),
			label: removedMovie[0].name
		});
	}

	render () {
		let helpText = <>Select two or more <span className={styles.highlighted}>Movies</span></>;
		let commonCredits = null;
		if(this.state.movies.length>1){
			if(this.state.commonCredits.length>0){
				helpText = `Common Actors(${this.state.commonCredits.length}):`;
				
				commonCredits = <div className={styles.commonCreditsWrapper}>
									<Credits credits={this.state.commonCredits} displayType="row" expanded />
								</div>;
			} else {
				helpText = "No common Actors found";
			}
		}
		return (
			<div className={styles.MoviesComparison}>
				<div className={styles.autocompleteWrapper}>
					<Autocomplete
						matches={this.state.autocompleteNames}
						change={this.searchChange}
						select={this.searchSelect}
						placeholder="Start typing a title.."
						focused={true} />
				</div>
				<div className={styles.helpText}>{helpText}</div>
				{commonCredits}
				<div className={styles.Movies}>
					{this.state.movies.map((movie, i) =>
						<ComparedItem
							key={i}
							data={movie}
							remove={() => this.removeMovie(i)} />
					)}
					{this.state.pendingMovies.map(movie =>
						<ComparedItem
							key={movie.id}loading />
					)}
				</div>
			</div>
		);
	}
}

export default MoviesComparison;
