const fs = require('fs');
const path = require('path');
const Dev = artifacts.require('Dev');

module.exports = async function(deployer) {
	await deployer.deploy(Dev);
	const DevInstance = await Dev.deployed();
	let data = "const DevAddress = '" + DevInstance.address + "';\n" +
		"const networkName = '" + deployer.network + "';\n" +
		"export { DevAddress, networkName };\n";
	fs.writeFile(path.join(__dirname,  '../src/config/deployment-info.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});
};
