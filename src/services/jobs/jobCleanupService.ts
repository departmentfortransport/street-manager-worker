import { inject } from 'inversify'
import TYPES from '../../types'
import { injectable } from 'inversify'
import { BatchV1Api, V1Job } from '@kubernetes/client-node'
import JobStatusService from './jobStatusService'

@injectable()
export default class JobCleanupService {

  public constructor(
    @inject(TYPES.K8sBatchV1Api) private k8s: BatchV1Api,
    @inject(TYPES.JobStatusService) private jobStatusService: JobStatusService,
    @inject(TYPES.NAMESPACE) private NAMESPACE: string) {}

  public async cleanupJobs(): Promise<void> {
    const jobsToCleanup: string[] = await this.getJobsToCleanup()

    if (jobsToCleanup.length > 0) {
      await Promise.all(jobsToCleanup.map((job: string) => this.cleanupJob(job)))
    }
  }

  private async getJobsToCleanup(): Promise<string[]> {
    return (await this.jobStatusService.getFinishedJobs()).map(this.getJobName)
  }

  private getJobName(job: V1Job): string {
    return job.metadata.name
  }

  private async cleanupJob(job: string): Promise<void> {
    await this.k8s.deleteNamespacedJob(job, this.NAMESPACE)
  }
}
