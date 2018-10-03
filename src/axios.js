import axios from 'axios';

const personAutocomplete = axios.create({
	baseURL: 'http://localhost:3001'
});

const theMovieDB = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: {
		'api_key': process.env.REACT_APP_THEMOVIEDB_API_KEY
	}
});

export { personAutocomplete, theMovieDB };
