const EthSwap = artifacts.require("EthSwap");
const Dacether = artifacts.require("Dacether");

module.exports = async function(deployer) {
  await deployer.deploy(Dacether);
  const dacether = await Dacether.deployed(); // fetch the S.C. data Dacether

  await deployer.deploy(EthSwap, dacether.address);
  const ethSwap = await EthSwap.deployed(); // fetch the S.C. data EthSwap

  // Transfer all tokens to EthSwap 1 million
  await dacether.transfer(ethSwap.address, "1000000000000000000000000");
};
