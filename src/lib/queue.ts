import cuid from 'cuid';
import { logger as loggerFactory } from './logger';

export enum JobStatus {
  NONQUEUED = 'nonqueued',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

type Job<T> = {
  id: string;
  status: JobStatus;
  args: T;
  startedAt?: Date;
  finishedAt?: Date;
};

type Handler<T> = (payload: T) => unknown | Promise<unknown>;
export interface Worker<T> {
  createJob: (payload: T) => Promise<string>;
  listJobs: () => Job<T>[];
  getJob: (jobId: string) => Job<T> | undefined;
}

type QueueArgs<T> = {
  name: string;
  handler: Handler<T>;
  options?: {
    maxConcurrency: number;
  };
};

type UpdateJobData = {
  status?: JobStatus;
  startedAt?: Date;
  finishedAt?: Date;
};

export function queue<T>({ name, handler, options }: QueueArgs<T>): Worker<T> {
  const jobs: Job<T>[] = [];
  setInterval(() => {
    console.table(jobs);
    console.log();
  }, 1000);
  const logger = loggerFactory(`Queue(${name})`);

  const wrapAsync = (jobId: string, fn: () => unknown | Promise<unknown>) => {
    setImmediate(async () => {
      try {
        updateJob(jobId, {
          status: JobStatus.RUNNING,
          startedAt: new Date(),
        });
        logger.info(`${jobId} - running`);
        await fn();
        updateJob(jobId, {
          status: JobStatus.COMPLETED,
          finishedAt: new Date(),
        });
        logger.info(`${jobId} - completed`);
      } catch (error) {
        updateJob(jobId, {
          status: JobStatus.FAILED,
          finishedAt: new Date(),
        });
        logger.error(`${jobId} - failed`);
      } finally {
        const nextPendingJob = jobs.find(
          (job) => job.status === JobStatus.PENDING
        );
        if (!nextPendingJob) return;
        return evaluate(nextPendingJob);
      }
    });
  };

  const evaluate = (job: Job<T>) => {
    if (job.status === JobStatus.NONQUEUED)
      jobs.push({ ...job, status: JobStatus.PENDING });

    if (!options?.maxConcurrency) {
      wrapAsync(job.id, async () => handler(job.args));
    }
    const jobsRunningCount = jobs.filter(
      (job) => job.status === JobStatus.RUNNING
    ).length;

    if (jobsRunningCount < options?.maxConcurrency!) {
      wrapAsync(job.id, async () => handler(job.args));
    }

    return;
  };

  const updateJob = (jobId: string, updateJobData: UpdateJobData) => {
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex === -1) return;

    Object.entries(updateJobData).forEach(([key, value]) => {
      // @ts-ignore
      jobs[jobIndex][key] = value;
    });
  };

  const createJob = async (payload: T) => {
    const job = {
      args: payload,
      id: cuid(),
      status: JobStatus.NONQUEUED,
    };
    logger.info(`new job - ${JSON.stringify(job, null, 1)}`);
    evaluate(job);

    return job.id;
  };
  const listJobs = () => jobs;
  const getJob = (jobId: string) => jobs.find((job) => job.id === jobId);

  return {
    createJob,
    listJobs,
    getJob,
  };
}
