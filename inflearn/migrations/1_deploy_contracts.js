const mintAnimalToken = artifacts.require("MintAnimalToken");
const saleAnimalToken = artifacts.require("SaleAnimalToken");

module.exports = async function (deployer) {
  await deployer.deploy(mintAnimalToken);
  await deployer.deploy(saleAnimalToken, mintAnimalToken.address);
};
