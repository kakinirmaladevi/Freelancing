# ChainWork — Decentralized Freelancing DApp

A blockchain-based freelancing platform built with Solidity, Truffle, Ganache, and vanilla HTML/JS frontend.

---

## Prerequisites

Install these before starting:
- [Node.js](https://nodejs.org/) v16+
- [Truffle](https://trufflesuite.com/) — `npm install -g truffle`
- [Ganache](https://trufflesuite.com/ganache/) — Download the GUI app
- [MetaMask](https://metamask.io/) — Browser extension

---

## Setup & Run (Step by Step)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Start Ganache
- Open the Ganache GUI app
- Click "Quickstart Ethereum"
- It runs on http://127.0.0.1:7545 by default
- You'll see 10 test accounts with 100 ETH each

### Step 3 — Compile the smart contract
```bash
truffle compile
```

### Step 4 — Deploy to Ganache
```bash
truffle migrate --network development
```
Copy the contract address shown in the terminal output (looks like: `0xABC123...`)

### Step 5 — Update frontend with contract address
Open `src/index.html` and replace:
```js
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
```
with your actual deployed address from Step 4.

### Step 6 — Connect MetaMask to Ganache
1. Open MetaMask → Add Network
2. Network Name: Ganache Local
3. RPC URL: http://127.0.0.1:7545
4. Chain ID: 1337
5. Currency: ETH

### Step 7 — Import a Ganache account into MetaMask
1. In Ganache GUI, click the key icon next to any account
2. Copy the private key
3. In MetaMask → Import Account → Paste private key

### Step 8 — Open the frontend
Open `src/index.html` directly in your browser (double-click it).
No server needed!

---

## Project Structure

```
freelance-dapp/
├── contracts/
│   ├── Freelance.sol          ← Main smart contract
│   └── Migrations.sol         ← Truffle migration helper
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_freelance.js  ← Deploys Freelance.sol
├── test/
│   └── freelance.test.js      ← Unit tests
├── src/
│   └── index.html             ← Full frontend app
├── truffle-config.js          ← Truffle + Ganache config
├── package.json
└── README.md
```

---

## How to Use the App

### As a Client (Job Poster):
1. Connect MetaMask wallet
2. Click "Post a Job"
3. Enter title, description, budget in ETH
4. Click "Lock Payment & Post Job" — ETH is locked in escrow
5. When freelancer submits work, go to "My Jobs" and Approve or Dispute

### As a Freelancer:
1. Connect MetaMask with a DIFFERENT Ganache account
2. Go to "Browse Jobs" and accept an open job
3. Complete the work, then go to "My Jobs"
4. Click "Submit Work" and paste your work link/proof
5. Wait for client approval — ETH auto-transfers on approval

---

## Smart Contract Functions

| Function | Who calls it | What it does |
|---|---|---|
| `postJob(title, desc)` | Client | Creates job, locks ETH in contract |
| `acceptJob(jobId)` | Freelancer | Takes the job |
| `submitWork(jobId, proof)` | Freelancer | Submits work proof |
| `approveWork(jobId)` | Client | Releases ETH to freelancer |
| `raiseDispute(jobId)` | Client | Marks job as disputed |
| `refundClient(jobId)` | Client | Refunds ETH back to client |
| `getAllJobs()` | Anyone | Returns all jobs |

---

## Run Tests
```bash
truffle test
```

---

## Tech Stack
- **Smart Contract**: Solidity ^0.8.0
- **Framework**: Truffle v5
- **Local Blockchain**: Ganache
- **Wallet**: MetaMask
- **Frontend**: HTML + CSS + JavaScript
- **Web3 Library**: web3.js v1.10
