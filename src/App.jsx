import React from 'react';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './config/drizzle-config';
import store from './middleware';
import LoadInitialData from './LoadInitialData';
import Content from './Content';

function App(props) {
	return (
		<DrizzleProvider store={store} options={drizzleConfig}>
			<>
				<Content />
				<LoadInitialData />
			</>
		</DrizzleProvider>
	);
}

export default App;
