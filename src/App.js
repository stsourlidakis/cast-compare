import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import PersonCompare from './containers/PersonCompare/PersonCompare'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route path="/people/:ids+" component={PersonCompare} />
						<Route path="*" component={PersonCompare} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
