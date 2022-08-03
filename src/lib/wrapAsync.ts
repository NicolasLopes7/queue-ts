import { JobStatus, UpdateJobCB } from './types';

export const wrapAsyncFactory =
  (updateJobCB: UpdateJobCB, nextCB: () => void) =>
  (jobId: string, fn: () => unknown | Promise<unknown>) => {
    setImmediate(async () => {
      try {
        updateJobCB(jobId, {
          status: JobStatus.RUNNING,
          startedAt: new Date(),
        });
        await fn();
        updateJobCB(jobId, {
          status: JobStatus.COMPLETED,
          finishedAt: new Date(),
        });
      } catch (error) {
        updateJobCB(jobId, {
          status: JobStatus.FAILED,
          finishedAt: new Date(),
        });
      } finally {
        nextCB();
      }
    });
  };
