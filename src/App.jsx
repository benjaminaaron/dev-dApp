import React, { Component } from 'react';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './config/drizzle-config';
import store from './middleware';
import LoadInitialData from './LoadInitialData';

class App extends Component {
	render() {
		return (
			<DrizzleProvider store={store} options={drizzleConfig}>
				<>
					test123
					<LoadInitialData />
				</>
			</DrizzleProvider>
		);
	}
}

export default App;
