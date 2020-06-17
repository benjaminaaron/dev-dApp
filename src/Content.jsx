import React, { useState, useRef } from 'react';

import { DevContractAddress } from './config/deployment-info.js';
import Web3 from 'web3';
import { ethers } from "ethers";
const truffleContract = require("@truffle/contract");

const useForceUpdate = () => { // via https://stackoverflow.com/a/53837442/2474159
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

function Content(props) {

    const contractEvents = useRef([]);
    const forceUpdate = useForceUpdate();
    const [defaultAccount, setDefaultAccount] = useState(null);

    const click1 = () => {
        window.web3 = new Web3(window.ethereum);
        try {
            window.ethereum.enable();

            let user = window.web3.eth.accounts.currentProvider.selectedAddress;
            console.log("user", user);
            setDefaultAccount(user);
        } catch (error) {
            console.log("error", error);
        }
    };

    // @truffle/contract

    const click3 = () => {
        const json = require('./build/contracts/DevContract.json');
        let Contractor = truffleContract({
            abi: json.abi
        });
        Contractor.setProvider(window.web3.currentProvider);
        let contractDeployed = Contractor.at(DevContractAddress);

        contractDeployed.then(function(instance) {
            return instance['triggerEvent']({
                from: defaultAccount
            });
        })
        .then(function(result) {
            console.log('Results of submitting: ', result);
        })
        .catch(function(err) {
            console.log('Error: ', err.message);
        });
    };

    // web3

    const [contractWeb3, setContractWeb3] = useState(null);

    const click4 = () => {
        window.web3 = new Web3(window.ethereum);
        const json = require('./build/contracts/DevContract.json');
        setContractWeb3(new window.web3.eth.Contract(
            json.abi,
            DevContractAddress
        ));
        console.log("Contract added");
    };

    const click5 = () => {
        let eventName = 'TestEvent';

        const eventJsonInterface = window.web3.utils._.find(
            contractWeb3._jsonInterface,
            o => o.name === eventName && o.type === 'event',
        );

        window.web3.eth.subscribe('logs', {
                address: contractWeb3.options.address,
                topics: [eventJsonInterface.signature]
            }, (error, result) => {
                if (error) {
                    console.log("error", error);
                    return;
                }
                const eventObj = window.web3.eth.abi.decodeLog(
                    eventJsonInterface.inputs,
                    result.data,
                    result.topics.slice(1)
                );
                console.log('New event:', eventObj);
                contractEvents.current.push(eventObj);
                forceUpdate();
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

    const click6 = () => {
        contractWeb3.methods.triggerEvent().send({
            from: defaultAccount
        })
        .then(function(result) {
            console.log('Result: ', result);
        });
    };

    // ethers

    const [ethersContract, setEthersContract] = useState(null);
    const ethersEvents = useRef([]);

    const click7 = () => {
        const json = require('./build/contracts/DevContract.json');

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        let _ethersContract = new ethers.Contract(
            DevContractAddress,
            json.abi,
            signer
        );

        _ethersContract.on('TestEvent', (...args) => {
            console.log('ethers received TestEvent:', args);
            ethersEvents.current.push((args.pop()).args);
            forceUpdate();
        });

        setEthersContract(_ethersContract);
    };

    const click8 = () => {
        ethersContract.triggerEvent().then(function(tx) {
            console.log('ethers tx result:', tx);
        });
    };

    return (
        <>
            <table border="1">
                <tbody>
                    <tr>
                        <td>

                            <a href="#" onClick={click1}>Unlock account</a>

                            <h2>web3</h2>
                            <a href="#" onClick={click4}>1. Add contract</a>
                            <br/>
                            <a href="#" onClick={click5}>2. Subscribe to TestEvent using <b>web3</b></a>
                            <br/>
                            <a href="#" onClick={click6}>3. Trigger contract event using <b>web3 send()</b></a>

                            <h2>@truffle/contract</h2>
                            <a href="#" onClick={click3}>Trigger contract event using <b>@truffle/contract</b></a>

                            <h2>ethers</h2>
                            <a href="#" onClick={click7}>1. Add contract and event listener</a>
                            <br/>
                            <a href="#" onClick={click8}>2. Trigger contract event using <b>ethers</b></a>
                        </td>
                        <td>
                            <h3>Contract events received via web3 subscription:</h3>
                            {contractEvents.current.map((obj, index) => {
                                return (
                                    <div key={'web3_' + index}><small>{obj.contractAddress}</small> says: {obj.numb}</div>
                                )})}
                            <h3>Contract events received via ethers subscription:</h3>
                            {ethersEvents.current.map((obj, index) => {
                                return (
                                    <div key={'ethers_' + index}><small>{obj.contractAddress}</small></div>
                                )})}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Content;