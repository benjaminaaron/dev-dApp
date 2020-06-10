import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';

const contractEventNotifier = store => next => action => {
	if (action.type !== EventActions.EVENT_FIRED) {
		return next(action);
	}

	const contractEvent = action.event.event;

	if (contractEvent === 'TestEvent') {
		console.log(action);

		store.dispatch({
			type: 'TEST_DISPATCH',
			object: action
		});
	}
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	arr: []
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
				arr: [...state.arr, ...action.object]
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
