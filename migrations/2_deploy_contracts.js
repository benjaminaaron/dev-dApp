const fs = require('fs');
const path = require('path');
const DevContract = artifacts.require('DevContract');

module.exports = async function(deployer) {
	await deployer.deploy(DevContract);
	const DevContractInstance = await DevContract.deployed();
	let data = "const DevContractAddress = '" + DevContractInstance.address + "';\n" +
		"const networkName = '" + deployer.network + "';\n" +
		"export { DevContractAddress, networkName };\n";
	fs.writeFile(path.join(__dirname,  '../src/config/deployment-info.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});
};
