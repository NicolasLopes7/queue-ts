import { queue } from '../../src/lib/queue';
import { Job } from '../../src/lib/types';

describe('simple queue', () => {
  const handlerMockFn = jest.fn(() => {});
  type TestQueueJobArgs = { name: string };

  const testQueue = queue<TestQueueJobArgs>({
    name: 'test',
    handler: handlerMockFn,
  });

  it('should start with no jobs', () => {
    const jobs = testQueue.listJobs();

    expect(jobs).toHaveLength(0);
  });

  it('should be able to create a job', async () => {
    const jobId = testQueue.createJob({ name: 'nicolas' });
    expect(jobId).toBeDefined();

    const job: Job<TestQueueJobArgs> = await new Promise((resolve) => {
      setTimeout(() => {
        const job = testQueue.getJob(jobId);
        resolve(job!);
      }, 200);
    });

    expect(job).toBeDefined();
    expect(job.status).toBe('completed');
    expect(job).toHaveProperty('finishedAt');
    expect(job).toHaveProperty('startedAt');
  });
});
