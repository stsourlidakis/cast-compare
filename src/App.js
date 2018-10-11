import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import PersonCompare from './containers/PersonCompare/PersonCompare'
import Footer from './components/UI/Footer/Footer'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route path="/people/:ids+" component={PersonCompare} />
						<Route path="*" component={PersonCompare} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
