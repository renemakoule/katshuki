// Defining the structure of a job
export interface Job {
  id: string;
  useCase: string;
  params: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the job queue service
export interface IJobQueueService {
  enqueue(useCase: string, params: Record<string, any>): Promise<Job>;
  getJobStatus(jobId: string): Promise<Job | null>;
}

export class JobQueueService implements IJobQueueService {
  // In a real application, this would be a distributed queue (e.g., Redis, RabbitMQ)
  private queue: Map<string, Job> = new Map();

  public async enqueue(useCase: string, params: Record<string, any>): Promise<Job> {
    const jobId = `job_${Math.random().toString(36).substr(2, 9)}`;
    const newJob: Job = {
      id: jobId,
      useCase,
      params,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.queue.set(jobId, newJob);
    console.log(`Job enqueued: ${jobId} for use case ${useCase}`);
    
    // In a real system, a worker would pick this up. Here we can simulate it.
    this.processJob(newJob);

    return newJob;
  }

  public async getJobStatus(jobId: string): Promise<Job | null> {
    return this.queue.get(jobId) || null;
  }

  // Mock processing
  private async processJob(job: Job) {
    setTimeout(() => {
      job.status = 'completed';
      job.updatedAt = new Date();
      this.queue.set(job.id, job);
      console.log(`Job completed: ${job.id}`);
    }, 10000); // Simulate a 10-second task
  }
}
