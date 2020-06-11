import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

function ShowSomething(props, context) {

    const click1 = () => {
        let contract = context.drizzle.contracts.DevContract;
        const stackId = contract.methods.triggerEvent.cacheSend({ from: props.defaultAccount });
    };

    const click2 = () => {
        // TODO
    };

	return (
        <>
            <a href="#" onClick={click1}>Trigger contract event using <b>cacheSend</b></a>
            <br/>
            <a href="#" onClick={click2}>Trigger contract event using ?</a>
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