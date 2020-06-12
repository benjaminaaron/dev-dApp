const path = require('path');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const config = require('./config.json');

module.exports = {
	contracts_build_directory: path.join(__dirname, 'src/build/contracts'),
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*'
		},
		rinkeby: {
			provider: function() {
				return new HDWalletProvider(config.MNEMONIC, 'https://rinkeby.infura.io/v3/' + config.INFURA_API_KEY);
			},
			network_id: 4,
			gas: 7465030,
			gasPrice: 10000000000
		}
	},
	compilers: {
		solc: {
			version: "0.5.17",
		  	settings: {
				optimizer: {
					enabled: true,
					runs: 200
				},
			}
		}
	}
};
