import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import PeopleComparison from './containers/PeopleComparison/PeopleComparison'
import Footer from './components/UI/Footer/Footer'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route path="/people/:ids+" component={PeopleComparison} />
						<Route path="*" component={PeopleComparison} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
