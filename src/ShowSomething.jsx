import React from 'react';
import { drizzleConnect } from 'drizzle-react';

function ShowSomething(props) {
	return (
        <>
            <b>Contract events received</b>:
            {props.contractEventsReceived.map((obj, index) => {
                return (
                    <div key={index}><small>{obj.contractAddress}</small> says: {obj.numb}</div>
                )})}
        </>
    )
}

const mapStateToProps = state => {
	return {
		contractEventsReceived: state.dappStore.contractEventsReceived
	};
};

export default drizzleConnect(ShowSomething, mapStateToProps);