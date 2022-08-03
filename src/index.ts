import express from 'express';
import { test, TestArgs } from './jobs/test';
import { queue } from './lib/queue';

const server = express();

const testQueue = queue<TestArgs>({
  name: 'test',
  handler: test,
  options: {
    maxConcurrency: 1,
  },
});

server.use(express.json());

server.get('/', (req, res) => {
  const jobId = testQueue.createJob({ name: 'bilada' });
  return res.json({ jobId }).status(201);
});

server.listen(4000, () => {
  console.log('running at http://localhost:4000');

  setInterval(() => {
    const jobs = testQueue.listJobs();
    console.table(jobs);
    console.log();
  }, 1000);
});
