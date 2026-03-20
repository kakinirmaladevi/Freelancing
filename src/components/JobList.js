import React, { useState } from "react";

function JobList({ jobs, account, contract, refresh, statusLabel, statusColor }) {
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const acceptJob = async (jobId) => {
    try {
      setLoadingId(jobId);
      await contract.methods.acceptJob(jobId).send({ from: account });
      await refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const openJobs = jobs.filter(j => {
    if (filter === "open") return j.status === 0;
    if (filter === "mine") return j.client.toLowerCase() === account.toLowerCase();
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Find work and get paid instantly via smart contract</p>
      </div>

      <div className="filter-bar">
        <button className={filter === "all" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("all")}>All Jobs</button>
        <button className={filter === "open" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("open")}>Open Only</button>
        <button className={filter === "mine" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("mine")}>Posted by Me</button>
      </div>

      {openJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No jobs found</h3>
          <p>Be the first to post a job!</p>
        </div>
      ) : (
        <div className="job-grid">
          {openJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-card-top">
                <span className="job-id">#{job.id}</span>
                <span className="status-badge" style={{ background: statusColor[job.status] + "22", color: statusColor[job.status], border: `1px solid ${statusColor[job.status]}44` }}>
                  {statusLabel[job.status]}
                </span>
              </div>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-desc">{job.description}</p>
              <div className="job-meta">
                <div className="job-budget">
                  <span className="budget-eth">{job.budget} ETH</span>
                  <span className="budget-label">Budget</span>
                </div>
                <div className="job-client">
                  <span className="client-label">Client</span>
                  <span className="client-addr">{job.client.slice(0, 6)}...{job.client.slice(-4)}</span>
                </div>
                <div className="job-date">
                  <span className="date-label">Posted</span>
                  <span>{job.createdAt}</span>
                </div>
              </div>
              {job.status === 0 && job.client.toLowerCase() !== account.toLowerCase() && (
                <button
                  className="btn-accept"
                  onClick={() => acceptJob(job.id)}
                  disabled={loadingId === job.id}
                >
                  {loadingId === job.id ? "Accepting..." : "Accept Job"}
                </button>
              )}
              {job.client.toLowerCase() === account.toLowerCase() && (
                <div className="your-job-badge">Your Job</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
