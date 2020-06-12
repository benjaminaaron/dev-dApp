import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { DevContractAddress } from './config/deployment-info.js';
import Web3 from 'web3';
const truffleContract = require("@truffle/contract");

function ShowSomething(props, context) {

    const [events, setEvents] = useState([]);

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
        const json = require('./build/contracts/DevContract.json');
        let Contractor = truffleContract({
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

    const click4 = () => {
        let web3 = new Web3(window.ethereum);
        const json = require('./build/contracts/DevContract.json');
        let contract = new web3.eth.Contract(
            json.abi,
            DevContractAddress
        );
        contract.methods.triggerEvent().send({
            from: props.defaultAccount
        })
        .then(function(result) {
            console.log('Result: ', result);
        });
    };

    const click5 = () => {
        let web3 = new Web3(window.ethereum);
        const json = require('./build/contracts/DevContract.json');
        let contract = new web3.eth.Contract(
            json.abi,
            DevContractAddress
        );
        let eventName = 'TestEvent';

        const eventJsonInterface = web3.utils._.find(
            contract._jsonInterface,
            o => o.name === eventName && o.type === 'event',
        );

        const subscription = web3.eth.subscribe('logs', {
                address: contract.options.address,
                topics: [eventJsonInterface.signature]
            }, (error, result) => {
                if (error) {
                    return;
                }
                const eventObj = web3.eth.abi.decodeLog(
                    eventJsonInterface.inputs,
                    result.data,
                    result.topics.slice(1)
                );
                console.log('New event:', eventObj)
                setEvents([...events, "new"]);
        })
        .on('connected', function(subscriptionId) {
            console.log("subscriptionId:", subscriptionId);
        })
        .on('data', function(log) {
            console.log('data:', log);
        })
        .on('changed', function(log) {
            console.log('changed:', log);
        });

        console.log("subscribed to TestEvent on DevContract");
    };

    return (
        <>
            <a href="#" onClick={click1}>Trigger contract event using <b>drizzle cacheSend()</b></a>
            <br/>
            <a href="#" onClick={click2}>Trigger contract event using <b>drizzle send()</b></a>
            <br/>
            <a href="#" onClick={click3}>Trigger contract event using <b>@truffle/contract</b></a>
            <br/>
            <a href="#" onClick={click4}>Trigger contract event using <b>web3 send()</b></a>
            <br/><br/>
            <a href="#" onClick={click5}>Subscribe to TestEvent using <b>web3</b></a>
            <br/><br/>
            <b>Contract events received via redux store</b>:
            {props.contractEventsReceived.map((obj, index) => {
                return (
                    <div key={index}><small>{obj.contractAddress}</small> says: {obj.numb}</div>
                )})}
            <br/><br/>
            <b>Contract events received via subscriptions</b>:
            {events.map((obj, index) => {
                return (
                    <div key={index}><small>event</small>: {index}</div>
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