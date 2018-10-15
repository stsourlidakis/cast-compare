import axios from 'axios';

const autoCompleteBaseUrl = process.env.NODE_ENV==='production' ? process.env.REACT_APP_AUTOCOMPLETE_URL : 'http://localhost:3001';

const personAutocomplete = axios.create({
	baseURL: `${autoCompleteBaseUrl}/person`
});

const theMovieDB = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: {
		'api_key': process.env.REACT_APP_THEMOVIEDB_API_KEY
	}
});

export { personAutocomplete, theMovieDB };
