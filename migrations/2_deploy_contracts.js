const MecToken = artifacts.require("./MecToken.sol");

module.exports = function (deployer) {
  deployer.deploy(MecToken, 1000000);
};
