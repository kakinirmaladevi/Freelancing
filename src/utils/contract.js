// After deploying with truffle migrate, copy the contract address from terminal
// and paste it in CONTRACT_ADDRESS below.
// Also copy the ABI from build/contracts/Freelance.json into FREELANCE_ABI.

export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

export const FREELANCE_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_title", "type": "string" }, { "internalType": "string", "name": "_description", "type": "string" }],
    "name": "postJob", "outputs": [], "stateMutability": "payable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "acceptJob", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }, { "internalType": "string", "name": "_proof", "type": "string" }],
    "name": "submitWork", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "approveWork", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "raiseDispute", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "refundClient", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [], "name": "getAllJobs",
    "outputs": [{ "components": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address payable", "name": "client", "type": "address" },
      { "internalType": "address payable", "name": "freelancer", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "budget", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "string", "name": "workProof", "type": "string" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
    ], "internalType": "struct Freelance.Job[]", "name": "", "type": "tuple[]" }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_jobId", "type": "uint256" }],
    "name": "getJob",
    "outputs": [{ "components": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address payable", "name": "client", "type": "address" },
      { "internalType": "address payable", "name": "freelancer", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "budget", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "string", "name": "workProof", "type": "string" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
    ], "internalType": "struct Freelance.Job", "name": "", "type": "tuple" }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [], "name": "jobCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view", "type": "function"
  }
];
