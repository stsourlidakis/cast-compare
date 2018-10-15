import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import PeopleComparison from './containers/PeopleComparison/PeopleComparison'
import MoviesComparison from './containers/MoviesComparison/MoviesComparison'
import Footer from './components/UI/Footer/Footer'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route path="/movies/:ids*" component={MoviesComparison} />
						<Route path="/people/:ids*" component={PeopleComparison} />
						<Route path="*" component={MoviesComparison} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
