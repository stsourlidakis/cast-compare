import axios from 'axios';

const personAutocomplete = axios.create({
	baseURL: 'http://localhost:3001'
});

export { personAutocomplete };
