// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Freelance {
    enum JobStatus { Open, InProgress, Submitted, Completed, Disputed, Refunded }

    struct Job {
        uint id;
        address payable client;
        address payable freelancer;
        string title;
        string description;
        uint budget;
        JobStatus status;
        string workProof;
        uint createdAt;
    }

    uint public jobCount = 0;
    mapping(uint => Job) public jobs;

    event JobPosted(uint jobId, address client, string title, uint budget);
    event JobAccepted(uint jobId, address freelancer);
    event WorkSubmitted(uint jobId, string proof);
    event JobCompleted(uint jobId, address freelancer, uint amount);
    event DisputeRaised(uint jobId);
    event JobRefunded(uint jobId, address client, uint amount);

    modifier onlyClient(uint _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only client can do this");
        _;
    }

    modifier onlyFreelancer(uint _jobId) {
        require(msg.sender == jobs[_jobId].freelancer, "Only freelancer can do this");
        _;
    }

    function postJob(string memory _title, string memory _description) public payable {
        require(msg.value > 0, "Budget must be greater than 0");
        jobCount++;
        jobs[jobCount] = Job({
            id: jobCount,
            client: payable(msg.sender),
            freelancer: payable(address(0)),
            title: _title,
            description: _description,
            budget: msg.value,
            status: JobStatus.Open,
            workProof: "",
            createdAt: block.timestamp
        });
        emit JobPosted(jobCount, msg.sender, _title, msg.value);
    }

    function acceptJob(uint _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Job is not open");
        require(msg.sender != job.client, "Client cannot accept own job");
        job.freelancer = payable(msg.sender);
        job.status = JobStatus.InProgress;
        emit JobAccepted(_jobId, msg.sender);
    }

    function submitWork(uint _jobId, string memory _proof) public onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.InProgress, "Job is not in progress");
        job.workProof = _proof;
        job.status = JobStatus.Submitted;
        emit WorkSubmitted(_jobId, _proof);
    }

    function approveWork(uint _jobId) public onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Submitted, "Work not submitted yet");
        job.status = JobStatus.Completed;
        uint amount = job.budget;
        job.budget = 0;
        job.freelancer.transfer(amount);
        emit JobCompleted(_jobId, job.freelancer, amount);
    }

    function raiseDispute(uint _jobId) public onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Submitted, "Work not submitted yet");
        job.status = JobStatus.Disputed;
        emit DisputeRaised(_jobId);
    }

    function refundClient(uint _jobId) public onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "Job is not disputed");
        job.status = JobStatus.Refunded;
        uint amount = job.budget;
        job.budget = 0;
        job.client.transfer(amount);
        emit JobRefunded(_jobId, job.client, amount);
    }

    function getJob(uint _jobId) public view returns (Job memory) {
        return jobs[_jobId];
    }

    function getAllJobs() public view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCount);
        for (uint i = 1; i <= jobCount; i++) {
            allJobs[i - 1] = jobs[i];
        }
        return allJobs;
    }
}
