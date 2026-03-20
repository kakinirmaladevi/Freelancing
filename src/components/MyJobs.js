import React, { useState } from "react";

function MyJobs({ jobs, account, contract, refresh, statusLabel, statusColor }) {
  const [submission, setSubmission] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const clientJobs = jobs.filter(j => j.client.toLowerCase() === account.toLowerCase());
  const freelancerJobs = jobs.filter(j => j.freelancer.toLowerCase() === account.toLowerCase());

  const submitWork = async (jobId) => {
    const text = submission[jobId];
    if (!text) return alert("Please enter your submission link or description");
    try {
      setLoadingId(jobId);
      await contract.methods.submitWork(jobId, text).send({ from: account });
      await refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const approveWork = async (jobId) => {
    try {
      setLoadingId(jobId);
      await contract.methods.approveWork(jobId).send({ from: account });
      await refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const raiseDispute = async (jobId) => {
    try {
      setLoadingId(jobId);
      await contract.methods.raiseDispute(jobId).send({ from: account });
      await refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const cancelJob = async (jobId) => {
    try {
      setLoadingId(jobId);
      await contract.methods.cancelJob(jobId).send({ from: account });
      await refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const JobCard = ({ job, role }) => (
    <div className="job-card">
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
        {job.freelancer !== "0x0000000000000000000000000000000000000000" && (
          <div className="job-client">
            <span className="client-label">{role === "client" ? "Freelancer" : "Client"}</span>
            <span className="client-addr">
              {role === "client"
                ? `${job.freelancer.slice(0,6)}...${job.freelancer.slice(-4)}`
                : `${job.client.slice(0,6)}...${job.client.slice(-4)}`}
            </span>
          </div>
        )}
      </div>

      {/* Freelancer actions */}
      {role === "freelancer" && job.status === 1 && (
        <div className="action-area">
          <input
            className="form-input"
            placeholder="Paste your GitHub link, drive link, or description..."
            value={submission[job.id] || ""}
            onChange={(e) => setSubmission({ ...submission, [job.id]: e.target.value })}
          />
          <button className="btn-primary" onClick={() => submitWork(job.id)} disabled={loadingId === job.id}>
            {loadingId === job.id ? "Submitting..." : "Submit Work"}
          </button>
        </div>
      )}

      {job.status === 2 && job.workSubmission && (
        <div className="submission-box">
          <span className="submission-label">Submitted work:</span>
          <span className="submission-text">{job.workSubmission}</span>
        </div>
      )}

      {/* Client actions */}
      {role === "client" && job.status === 2 && (
        <div className="action-row">
          <button className="btn-approve" onClick={() => approveWork(job.id)} disabled={loadingId === job.id}>
            {loadingId === job.id ? "..." : "Approve & Release ETH"}
          </button>
          <button className="btn-dispute" onClick={() => raiseDispute(job.id)} disabled={loadingId === job.id}>
            Raise Dispute
          </button>
        </div>
      )}

      {role === "client" && job.status === 0 && (
        <button className="btn-cancel" onClick={() => cancelJob(job.id)} disabled={loadingId === job.id}>
          Cancel & Refund
        </button>
      )}

      {job.status === 3 && (
        <div className="completed-banner">Payment released to freelancer</div>
      )}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Jobs</h1>
        <p>Manage your active jobs as client or freelancer</p>
      </div>

      {clientJobs.length > 0 && (
        <section className="section">
          <h2 className="section-title">Jobs I Posted (Client)</h2>
          <div className="job-grid">
            {clientJobs.map(job => <JobCard key={job.id} job={job} role="client" />)}
          </div>
        </section>
      )}

      {freelancerJobs.length > 0 && (
        <section className="section">
          <h2 className="section-title">Jobs I'm Working On (Freelancer)</h2>
          <div className="job-grid">
            {freelancerJobs.map(job => <JobCard key={job.id} job={job} role="freelancer" />)}
          </div>
        </section>
      )}

      {clientJobs.length === 0 && freelancerJobs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No jobs yet</h3>
          <p>Post a job or accept one from the Browse page</p>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
