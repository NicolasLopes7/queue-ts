export enum JobStatus {
  NONQUEUED = 'nonqueued',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type Job<T> = {
  id: string;
  status: JobStatus;
  args: T;
  startedAt?: Date;
  finishedAt?: Date;
};

export type Handler<T> = (payload: T) => unknown | Promise<unknown>;
export interface Worker<T> {
  createJob: (payload: T) => string;
  listJobs: () => Job<T>[];
  getJob: (jobId: string) => Job<T> | undefined;
}

export type QueueArgs<T> = {
  name: string;
  handler: Handler<T>;
  options?: {
    maxConcurrency: number;
  };
};

export type UpdateJobData = {
  status?: JobStatus;
  startedAt?: Date;
  finishedAt?: Date;
};
