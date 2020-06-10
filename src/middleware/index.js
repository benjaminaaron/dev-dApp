import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';

const contractEventNotifier = store => next => action => {
	if (action.type !== EventActions.EVENT_FIRED) {
		return next(action);
	}

	const contractEvent = action.event.event;
	let values = action.event.returnValues;

	if (contractEvent === 'TestEvent') {
		console.log('TestEvent', action);

		store.dispatch({
			type: 'TEST_DISPATCH',
			contractAddress: values.contractAddress
		});
	}
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	contractAddresses: []
};

function dappStoreReducer(state = initialState, action) {
	switch (action.type) {
		case 'DRIZZLE_INITIALIZED':
			return {
				...state,
				drizzleInitialized: true
			};
		case 'TEST_DISPATCH':
			return Object.assign({}, state, {
				contractAddresses: [...state.contractAddresses, action.contractAddress]
			});
		default:
			return state;
	}
}

const appReducers = { dappStore: dappStoreReducer };

export default generateStore({
	drizzleOptions,
	appReducers,
	appMiddlewares,
	disableReduxDevTools: false
});
