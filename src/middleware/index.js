import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';

const contractEventNotifier = store => next => action => {
	if (action.type !== EventActions.EVENT_FIRED) {
		return next(action);
	}

	if (action.event.event === 'TestEvent') {
		console.log('TestEvent', action);

		store.dispatch({
			type: 'TEST_DISPATCH',
			obj: action.event.returnValues
		});
	}
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	contractEventsReceived: [],
	defaultAccount: null
};

function dappStoreReducer(state = initialState, action) {
	switch (action.type) {
		case 'ACCOUNT_BALANCE_FETCHED':
			return {
				...state,
				defaultAccount: action.account
			};
		case 'DRIZZLE_INITIALIZED':
			return {
				...state,
				drizzleInitialized: true
			};
		case 'TEST_DISPATCH':
			return Object.assign({}, state, {
				contractEventsReceived: [...state.contractEventsReceived, action.obj]
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
