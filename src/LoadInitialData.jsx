import { useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {

	const isInit = useRef({
		DevContract: false
	});

	useEffect(() => {
		if (!props.drizzleInitialized || !window.web3) {
			return;
		}

		if (!isInit.current.DevContract && props.contracts.DevContract.initialized) {
			isInit.current.DevContract = true;
		}
	});

	return null;
}

LoadInitialData.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		drizzleInitialized: state.dappStore.drizzleInitialized
	};
};

export default drizzleConnect(LoadInitialData, mapStateToProps);
