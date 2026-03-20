const Freelance = artifacts.require("Freelance");
module.exports = function (deployer) {
  deployer.deploy(Freelance);
};
