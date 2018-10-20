import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';

import './App.css';
import PeopleComparison from './containers/PeopleComparison/PeopleComparison';
import MoviesComparison from './containers/MoviesComparison/MoviesComparison';
import Menu from './components/UI/Menu/Menu';
import Footer from './components/UI/Footer/Footer';

ReactGA.initialize(process.env.REACT_APP_GA_ID);

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Menu/>
					<Switch>
						<Route path="/movies/:ids*" component={MoviesComparison} />
						<Route path="/" exact component={MoviesComparison} />
						<Route path="/people/:ids*" component={PeopleComparison} />
						<Redirect from="*" to="/" />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
