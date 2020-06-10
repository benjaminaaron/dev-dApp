import React from 'react';
import { drizzleConnect } from 'drizzle-react';

function ShowSomething(props) {
	return (
        <>
            <b>Contract addresses</b>:
            {props.contractAddresses.map((addr, index) => {
                return (
                    <div key={index}>{addr}</div>
                )})}
        </>
    )
}

const mapStateToProps = state => {
	return {
		contractAddresses: state.dappStore.contractAddresses
	};
};

export default drizzleConnect(ShowSomething, mapStateToProps);