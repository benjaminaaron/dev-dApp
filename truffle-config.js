const path = require('path');

module.exports = {
	contracts_build_directory: path.join(__dirname, 'src/build/contracts'),
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*'
		},
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
