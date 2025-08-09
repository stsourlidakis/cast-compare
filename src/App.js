import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import './App.css';
import PeopleComparison from './containers/PeopleComparison/PeopleComparison';
import MoviesComparison from './containers/MoviesComparison/MoviesComparison';
import Menu from './components/UI/Menu/Menu';
import Footer from './components/UI/Footer/Footer';

ReactGA.initialize(process.env.REACT_APP_GA_ID);

class App extends Component {
	render() {
		return (
			<BrowserRouter future={{ 
				v7_startTransition: true,
				v7_relativeSplatPath: true 
			}}>
				<div className="App">
					<Menu/>
					<Routes>
						<Route path="/movies/:ids?" element={<MoviesComparison />} />
						<Route path="/" element={<MoviesComparison />} />
						<Route path="/people/:ids?" element={<PeopleComparison />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
