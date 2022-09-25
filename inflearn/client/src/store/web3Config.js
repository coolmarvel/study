import mintAnimalTokenJson from "../build/contracts/MintAnimalToken.json";
import saleAnimalTokenJson from "../build/contracts/SaleAnimalToken.json";

import Web3 from "web3";

const web3 = new Web3(window.ethereum);

const mintAnimalTokenAbi = mintAnimalTokenJson.abi;
const mintAnimalTokenAddress = mintAnimalTokenJson.networks["5777"].address;
const mintAnimalTokenContract = new web3.eth.Contract(
  mintAnimalTokenAbi,
  mintAnimalTokenAddress
);

const saleAnimalTokenAbi = saleAnimalTokenJson.abi;
const saleAnimalTokenAddress = saleAnimalTokenJson.networks["5777"].address;
const saleAnimalTokenContract = new web3.eth.Contract(
  saleAnimalTokenAbi,
  saleAnimalTokenAddress
);

export {
  web3,
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
};
