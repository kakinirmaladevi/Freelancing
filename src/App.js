import React, { useState, useEffect } from "react";
import { loadWeb3, loadContract, getAccount, fromWei } from "./utils/web3Utils";
import PostJob from "./components/PostJob";
import JobList from "./components/JobList";
import MyJobs from "./components/MyJobs";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      setLoading(true);
      await loadWeb3();
      const acc = await getAccount();
      setAccount(acc);
      const ct = await loadContract();
      setContract(ct);
      await fetchJobs(ct);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (ct) => {
    const c = ct || contract;
    if (!c) return;
    const count = await c.methods.jobCount().call();
    const jobList = [];
    for (let i = 1; i <= count; i++) {
      const job = await c.methods.getJob(i).call();
      jobList.push({
        id: job[0],
        client: job[1],
        freelancer: job[2],
        title: job[3],
        description: job[4],
        budget: fromWei(job[5]),
        status: parseInt(job[6]),
        workSubmission: job[7],
        createdAt: new Date(job[8] * 1000).toLocaleDateString(),
      });
    }
    setJobs(jobList.reverse());
  };

  const statusLabel = ["Open", "In Progress", "Submitted", "Completed", "Disputed", "Cancelled"];
  const statusColor = ["#00c896", "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#6b7280"];

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Connecting to blockchain...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <h2>Connection Error</h2>
      <p>{error}</p>
      <button onClick={initApp}>Retry</button>
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">ChainWork</span>
          </div>
          <nav className="nav">
            <button className={activeTab === "browse" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("browse")}>Browse Jobs</button>
            <button className={activeTab === "post" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("post")}>Post a Job</button>
            <button className={activeTab === "myjobs" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("myjobs")}>My Jobs</button>
          </nav>
          <div className="wallet-badge">
            <span className="wallet-dot"></span>
            <span className="wallet-addr">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        </div>
      </header>

      <main className="main">
        {activeTab === "browse" && (
          <JobList jobs={jobs} account={account} contract={contract} refresh={fetchJobs} statusLabel={statusLabel} statusColor={statusColor} />
        )}
        {activeTab === "post" && (
          <PostJob account={account} contract={contract} refresh={fetchJobs} setActiveTab={setActiveTab} />
        )}
        {activeTab === "myjobs" && (
          <MyJobs jobs={jobs} account={account} contract={contract} refresh={fetchJobs} statusLabel={statusLabel} statusColor={statusColor} />
        )}
      </main>

      <footer className="footer">
        <p>ChainWork — Decentralized Freelancing on Ethereum · Powered by Truffle + Ganache</p>
      </footer>
    </div>
  );
}

export default App;
