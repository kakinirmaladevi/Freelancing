import Web3 from "web3";
import FreelanceABI from "../contracts/Freelance.json";

let web3;
let contract;

export const loadWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    alert("Please install MetaMask to use this DApp!");
    throw new Error("MetaMask not found");
  }
  return web3;
};

export const loadContract = async () => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = FreelanceABI.networks[networkId];
  if (!deployedNetwork) {
    alert("Contract not deployed on this network. Please connect to Ganache (port 7545).");
    throw new Error("Contract not deployed");
  }
  contract = new web3.eth.Contract(FreelanceABI.abi, deployedNetwork.address);
  return contract;
};

export const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const toWei = (amount) => web3.utils.toWei(amount.toString(), "ether");
export const fromWei = (amount) => web3.utils.fromWei(amount.toString(), "ether");

export { web3, contract };
