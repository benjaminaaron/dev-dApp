import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { DevContractAddress } from './config/deployment-info.js';

function ShowSomething(props, context) {

    const click1 = () => {
        let contract = context.drizzle.contracts.DevContract;
        const stackId = contract.methods.triggerEvent.cacheSend({ from: props.defaultAccount });
    };

    const click2 = () => {
        context.drizzle.contracts.DevContract.methods
			.triggerEvent()
			.send({ from: props.defaultAccount })
			.then(result => {
				console.log('Results of submitting: ', result);
			});
    };

    const click3 = () => {
        const contract = require('truffle-contract');
        const json = require('./build/contracts/DevContract.json');
        let Contractor = contract({
            abi: json.abi
        });
        Contractor.setProvider(window.web3.currentProvider);
        let contractDeployed = Contractor.at(DevContractAddress);

        contractDeployed.then(function(instance) {
            return instance['triggerEvent']({
                from: props.defaultAccount
            });
        })
        .then(function(result) {
            console.log('Results of submitting: ', result);
        })
        .catch(function(err) {
            console.log('Error: ', err.message);
        });
    };

	return (
        <>
            <a href="#" onClick={click1}>Trigger contract event using <b>cacheSend()</b></a>
            <br/>
            <a href="#" onClick={click2}>Trigger contract event using <b>send()</b></a>
            <br/>
            <a href="#" onClick={click3}>Trigger contract event using <b>instance.method()</b></a>
            <br/><br/>
            <b>Contract events received</b>:
            {props.contractEventsReceived.map((obj, index) => {
                return (
                    <div key={index}><small>{obj.contractAddress}</small> says: {obj.numb}</div>
                )})}
        </>
    )
}

ShowSomething.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contractEventsReceived: state.dappStore.contractEventsReceived,
		defaultAccount: state.dappStore.defaultAccount
	};
};

export default drizzleConnect(ShowSomething, mapStateToProps);