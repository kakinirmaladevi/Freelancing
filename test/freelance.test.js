const Freelance = artifacts.require("Freelance");

contract("Freelance", (accounts) => {
  const client = accounts[0];
  const freelancer = accounts[1];
  let instance;

  beforeEach(async () => {
    instance = await Freelance.new();
  });

  it("should post a job", async () => {
    await instance.postJob("Build a website", "Need a React website", {
      from: client,
      value: web3.utils.toWei("1", "ether"),
    });
    const job = await instance.getJob(1);
    assert.equal(job.title, "Build a website");
    assert.equal(job.client, client);
  });

  it("should accept a job", async () => {
    await instance.postJob("Build a website", "Need a React website", {
      from: client,
      value: web3.utils.toWei("1", "ether"),
    });
    await instance.acceptJob(1, { from: freelancer });
    const job = await instance.getJob(1);
    assert.equal(job.freelancer, freelancer);
    assert.equal(job.status.toString(), "1"); // InProgress
  });

  it("should submit work", async () => {
    await instance.postJob("Build a website", "Need a React website", {
      from: client,
      value: web3.utils.toWei("1", "ether"),
    });
    await instance.acceptJob(1, { from: freelancer });
    await instance.submitWork(1, "https://github.com/myproject", { from: freelancer });
    const job = await instance.getJob(1);
    assert.equal(job.status.toString(), "2"); // Submitted
  });

  it("should approve work and release funds", async () => {
    await instance.postJob("Build a website", "Need a React website", {
      from: client,
      value: web3.utils.toWei("1", "ether"),
    });
    await instance.acceptJob(1, { from: freelancer });
    await instance.submitWork(1, "https://github.com/myproject", { from: freelancer });
    await instance.approveWork(1, { from: client });
    const job = await instance.getJob(1);
    assert.equal(job.status.toString(), "3"); // Completed
  });
});
