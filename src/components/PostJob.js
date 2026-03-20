import React, { useState } from "react";
import { toWei } from "../utils/web3Utils";

function PostJob({ account, contract, refresh, setActiveTab }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget) return alert("Please fill all fields");
    try {
      setLoading(true);
      await contract.methods.postJob(title, description).send({
        from: account,
        value: toWei(budget),
      });
      setSuccess(true);
      setTitle(""); setDescription(""); setBudget("");
      await refresh();
      setTimeout(() => { setSuccess(false); setActiveTab("browse"); }, 2000);
    } catch (err) {
      alert("Transaction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Funds are locked in the smart contract until work is approved</p>
      </div>
      <div className="form-card">
        {success && <div className="success-banner">Job posted successfully! Redirecting...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g. Build a React Dashboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              placeholder="Describe what you need in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              rows={5}
            />
          </div>
          <div className="form-group">
            <label>Budget (ETH)</label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="e.g. 0.5"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="form-input"
            />
            <span className="form-hint">This amount will be locked in the smart contract as escrow</span>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Posting to blockchain..." : "Post Job & Lock Funds"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
